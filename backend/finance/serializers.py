from rest_framework import serializers
from .models import Category, Transaction, Budget
from datetime import date


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "type"]


class TransactionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )

    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = ["user", "created_at"]

    def validate(self, data):
        user = self.context["request"].user
        category = data.get("category")
        amount = data.get("amount")
        txn_date = data.get("date")

        if category and category.user != user:
            raise serializers.ValidationError(
                "Category does not belong to the current user."
            )

        if amount is not None and amount <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")

        if txn_date and txn_date > date.today():
            raise serializers.ValidationError("Date cannot be in the future.")

        return data


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

    def validate(self, data):
        user = self.context['request'].user
        month = data.get('month')
        year = data.get('year')
        amount = data.get('amount')

        if amount is not None and amount <= 0:
            raise serializers.ValidationError("Budget amount must be greater than 0.")

        if Budget.objects.filter(user=user, month=month, year=year).exists():
            raise serializers.ValidationError("Budget for this month and year already exists.")

        today = date.today()
        if year > today.year or (year == today.year and month > 12):
            raise serializers.ValidationError("Invalid month or year.")

        return data