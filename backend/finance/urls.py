from django.urls import path, include
from .views import (
    CategoryViewSet,
    TransactionViewSet,
    BudgetViewSet,
    DashboardSummaryView,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('transactions', TransactionViewSet, basename='transaction')
router.register('budgets', BudgetViewSet, basename='budget')

urlpatterns = [
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('', include(router.urls)),
]
