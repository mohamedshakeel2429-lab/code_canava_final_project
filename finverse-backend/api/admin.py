from django.contrib import admin
from .models import Transaction, FinancialGoal

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['description', 'category', 'amount', 'type', 'date']
    list_filter = ['type', 'category']
    search_fields = ['description']

@admin.register(FinancialGoal)
class FinancialGoalAdmin(admin.ModelAdmin):
    list_display = ['name', 'target', 'current', 'deadline']
