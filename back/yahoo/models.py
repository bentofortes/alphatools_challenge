from django.db import models

# Create your models here.
class Entry(models.Model):
    asset_name = models.CharField(max_length=100)
    price = models.FloatField()
    created_at_dt = models.DateTimeField()
