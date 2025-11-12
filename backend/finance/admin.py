from django.contrib import admin
from .models import Category, Transaction, Budget

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'type')
    list_filter = ('type',)
    search_fields = ('name', 'user__username')


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'category', 'amount', 'date', 'description')
    list_filter = ('category__type', 'date')
    search_fields = ('user__username', 'category__name', 'description')


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'month', 'year', 'amount')
    list_filter = ('month', 'year')
    search_fields = ('user__username',)
