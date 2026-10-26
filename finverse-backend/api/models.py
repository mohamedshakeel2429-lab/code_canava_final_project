from django.db import models
from decimal import Decimal


class Transaction(models.Model):
    EXPENSE = 'expense'
    INCOME = 'income'
    TYPE_CHOICES = [(EXPENSE, 'Expense'), (INCOME, 'Income')]

    CATEGORY_CHOICES = [
        ('Income', 'Income'), ('Housing', 'Housing'), ('Food', 'Food'),
        ('Transport', 'Transport'), ('Utilities', 'Utilities'),
        ('Entertainment', 'Entertainment'), ('Health', 'Health'),
        ('Education', 'Education'), ('Other', 'Other'),
    ]

    description = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default=EXPENSE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.description} — ${self.amount}"


class FinancialGoal(models.Model):
    name = models.CharField(max_length=200)
    target = models.DecimalField(max_digits=12, decimal_places=2)
    current = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    deadline = models.DateField(null=True, blank=True)
    color = models.CharField(max_length=20, default='#795548')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name
