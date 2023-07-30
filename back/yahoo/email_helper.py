import sys, os
import boto3


def send_email(greater: bool, tunnel, data):
  subject = f"Preço autal de {data.asset_name.upper()} = {data.price}R$"
  body = (f"O preço do ativo {data.asset_name} se encontra maior que o máximo definido de {tunnel[1]} reais. É recomendado vender.")
  if not greater:
    body = (f"O preço do ativo {data.asset_name} se encontra menor que o mínimo definido de {tunnel[0]} reais. É recomendado comprar.")


  client = boto3.client(
    'ses',
    region_name="us-east-1",
    aws_access_key_id=os.environ["AWS_ACCESS_KEY"] ,
    aws_secret_access_key=os.environ["AWS_SECRET_KEY"],
  )

  client.send_email(
    Source=os.environ["EMAIL_SENDER"],
    Destination={ 'ToAddresses': [os.environ["EMAIL_RECIPIENT"]] },
    Message={
      "Body": {
        "Text": {
          "Data": body
        }
      },
      "Subject": {
        "Data": subject
      }
    }
  )
