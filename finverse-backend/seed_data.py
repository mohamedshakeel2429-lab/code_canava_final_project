"""
Seed script — populates the database with demo transactions and goals.
Run: python seed_data.py
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finverse_backend.settings')
django.setup()

from api.models import Transaction, FinancialGoal
from datetime import date, timedelta

# Clear existing demo data
Transaction.objects.all().delete()
FinancialGoal.objects.all().delete()

today = date.today()
transactions = [
    ('Rent', 'Housing', 1200, today.replace(day=1), 'expense'),
    ('Salary', 'Income', 5800, today.replace(day=1), 'income'),
    ('Grocery Store', 'Food', 145, today - timedelta(days=2), 'expense'),
    ('Netflix', 'Entertainment', 18, today - timedelta(days=5), 'expense'),
    ('Electricity Bill', 'Utilities', 95, today - timedelta(days=6), 'expense'),
    ('Gym Membership', 'Health', 50, today - timedelta(days=7), 'expense'),
    ('Restaurant Dinner', 'Food', 68, today - timedelta(days=9), 'expense'),
    ('Freelance Payment', 'Income', 450, today - timedelta(days=12), 'income'),
    ('Uber Ride', 'Transport', 22, today - timedelta(days=14), 'expense'),
    ('Online Course', 'Education', 39, today - timedelta(days=15), 'expense'),
    ('Internet Bill', 'Utilities', 60, today - timedelta(days=16), 'expense'),
    ('Coffee Shop', 'Food', 28, today - timedelta(days=17), 'expense'),
    ('Spotify', 'Entertainment', 10, today - timedelta(days=18), 'expense'),
    ('Pharmacy', 'Health', 35, today - timedelta(days=20), 'expense'),
    ('Gas Station', 'Transport', 85, today - timedelta(days=22), 'expense'),
]

for desc, cat, amt, dt, tp in transactions:
    Transaction.objects.create(description=desc, category=cat, amount=amt, date=dt, type=tp)

goals = [
    ('Emergency Fund', 15000, 6200, today + timedelta(days=240), '#7C9274'),
    ('Vacation to Japan', 4500, 1800, today + timedelta(days=130), '#C6A15B'),
    ('New Laptop', 1800, 1200, today + timedelta(days=60), '#795548'),
]

for name, target, current, deadline, color in goals:
    FinancialGoal.objects.create(name=name, target=target, current=current, deadline=deadline, color=color)

print(f"[OK] Seeded {Transaction.objects.count()} transactions and {FinancialGoal.objects.count()} goals.")
