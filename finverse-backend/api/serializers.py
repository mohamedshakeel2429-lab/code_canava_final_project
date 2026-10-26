from rest_framework import serializers
from .models import Transaction, FinancialGoal


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        return value


class FinancialGoalSerializer(serializers.ModelSerializer):
    progress_pct = serializers.SerializerMethodField()

    class Meta:
        model = FinancialGoal
        fields = '__all__'

    def get_progress_pct(self, obj):
        if obj.target == 0:
            return 0
        return min(100, round((float(obj.current) / float(obj.target)) * 100, 1))

    def validate_target(self, value):
        if value <= 0:
            raise serializers.ValidationError("Target must be greater than 0.")
        return value
