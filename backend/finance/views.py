from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Sum
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer


class PaginationClass(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


# ---------------- Category ----------------
class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PaginationClass

    def get_queryset(self):
        queryset = Category.objects.filter(user=self.request.user)
        category_id = self.request.query_params.get('category_id')
        category_name = self.request.query_params.get('category_name')
        category_type = self.request.query_params.get('category_type')

        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if category_name:
            queryset = queryset.filter(category__name__icontains=category_name)
        if category_type:
            queryset = queryset.filter(category__type__icontains=category_type)
        
        return queryset

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response({
                "status": "error",
                "message": "You are not allowed to update this category."
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "status": "success",
            "message": "Category partially updated successfully.",
            "data": serializer.data
        })


    # ---- Consistent response overrides ----
    def list(self, request, *args, **kwargs):
        search = request.query_params.get('search')
        queryset = self.get_queryset()
        if search:
            queryset = queryset.filter(name__icontains=search)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response({
            "status": "success",
            "message": "Categories fetched successfully.",
            "data": serializer.data
        })

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({
                "status": "success",
                "message": "Category created successfully.",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "status": "error",
            "message": "Category creation failed.",
            "data": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response({
                "status": "error",
                "message": "You are not allowed to update this category."
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "status": "success",
            "message": "Category updated successfully.",
            "data": serializer.data
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response({
                "status": "error",
                "message": "You are not allowed to delete this category."
            }, status=status.HTTP_403_FORBIDDEN)

        instance.delete()
        return Response({
            "status": "success",
            "message": "Category deleted successfully."
        }, status=status.HTTP_204_NO_CONTENT)


# ---------------- Transaction ----------------
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PaginationClass

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        category_id = self.request.query_params.get('category_id')
        category_name = self.request.query_params.get('category_name')
        category_type = self.request.query_params.get('category_type')
        min_amount = self.request.query_params.get('min_amount')
        max_amount = self.request.query_params.get('max_amount')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if category_name:
            queryset = queryset.filter(category__name__icontains=category_name)
        if category_type:
            queryset = queryset.filter(category__type__icontains=category_type)
        if min_amount:
            queryset = queryset.filter(amount__gte=min_amount)
        if max_amount:
            queryset = queryset.filter(amount__lte=max_amount)
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])

        return queryset.order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        search = request.query_params.get('search')
        queryset = self.get_queryset()
        if search:
            queryset = queryset.filter(category__name__icontains=search)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response({
            "status": "success",
            "message": "Transactions fetched successfully.",
            "data": serializer.data
        })


# ---------------- Budget ----------------
class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PaginationClass

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response({
                "status": "error",
                "message": "You are not allowed to update this budget."
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "status": "success",
            "message": "Budget updated successfully.",
            "data": serializer.data
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response({
                "status": "error",
                "message": "You are not allowed to delete this budget."
            }, status=status.HTTP_403_FORBIDDEN)

        instance.delete()
        return Response({
            "status": "success",
            "message": "Budget deleted successfully."
        }, status=status.HTTP_204_NO_CONTENT)


# ---------------- Dashboard ----------------
class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        income = Transaction.objects.filter(
            user=user, category__type='income'
        ).aggregate(total=Sum('amount'))['total'] or 0

        expenses = Transaction.objects.filter(
            user=user, category__type='expense'
        ).aggregate(total=Sum('amount'))['total'] or 0

        balance = income - expenses

        return Response({
            "status": "success",
            "message": "Dashboard summary fetched successfully.",
            "data": {
                "total_income": income,
                "total_expenses": expenses,
                "balance": balance
            }
        })
