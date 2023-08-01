import json, pytz
from datetime import datetime, timedelta
import yfinance as yf
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound, JsonResponse
from django.core import serializers

from .models import Entry
from .email_helper import send_email


def get_prices(request):
  config = request.GET.get("config")
  if not config:
    return HttpResponseBadRequest("config is a required field")
  
  config = json.loads(config)

  data = []
  for i in config:
    ticker = yf.Ticker(i["asset_name"])

    new_entry = Entry(
      asset_name = i["asset_name"],
      price = ticker.get_info().get("currentPrice"),
      created_at_dt = datetime.now(tz=pytz.UTC)
    )

    ## send email
    prev_time = request.session.get("email_sent_at", (datetime.now(tz=pytz.UTC) - timedelta(minutes=30)).isoformat())
    prev_time = datetime.fromisoformat(prev_time)

    if datetime.now(tz=pytz.UTC) - prev_time > timedelta(minutes=5):
      if new_entry.price > float(i["max"]):
        request.session["email_sent_at"] = datetime.now(tz=pytz.UTC).isoformat()
        send_email(
          greater=True,
          tunnel=[float(i["max"]),float(i["max"])],
          data=new_entry
        )

      elif new_entry.price < float(i["min"]):
        request.session["email_sent_at"] = datetime.now(tz=pytz.UTC).isoformat()
        send_email(
          greater=False,
          tunnel=[float(i["max"]),float(i["max"])],
          data=new_entry
        )

    

    new_entry.save()
    data.append(new_entry)

  data = serializers.serialize("json", data)

  return HttpResponse(data)


def reload(request):
  all_entries = Entry.objects.all()

  ### erase entries older than 24 hours
  for entry in all_entries:
    if datetime.now(tz=pytz.UTC) - entry.created_at_dt > timedelta(hours=24):
      entry.delete()

  return HttpResponse(serializers.serialize("json", Entry.objects.all()))






