from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer
from django.db.models import Sum, Q
from datetime import datetime
import csv, io
from django.http import HttpResponse
import json


class PaginationClass(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 100


# ---------------- Category ----------------
class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PaginationClass

    def get_queryset(self):
        queryset = Category.objects.filter(user=self.request.user)
        category_id = self.request.query_params.get("category_id")
        category_name = self.request.query_params.get("category_name")
        category_type = self.request.query_params.get("category_type")

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
            return Response(
                {
                    "status": "error",
                    "message": "You are not allowed to update this category.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "status": "success",
                "message": "Category partially updated successfully.",
                "data": serializer.data,
            }
        )

    # ---- Consistent response overrides ----
    def list(self, request, *args, **kwargs):
        search = request.query_params.get("search")
        queryset = self.get_queryset()
        if search:
            queryset = queryset.filter(name__icontains=search)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(
            {
                "status": "success",
                "message": "Categories fetched successfully.",
                "data": serializer.data,
            }
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "status": "success",
                    "message": "Category created successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "status": "error",
                "message": "Category creation failed.",
                "data": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {
                    "status": "error",
                    "message": "You are not allowed to update this category.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "status": "success",
                "message": "Category updated successfully.",
                "data": serializer.data,
            }
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {
                    "status": "error",
                    "message": "You are not allowed to delete this category.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        instance.delete()
        return Response(
            {"status": "success", "message": "Category deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


# ---------------- Transaction ----------------
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PaginationClass

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        category_id = self.request.query_params.get("category_id")
        category_name = self.request.query_params.get("category_name")
        category_type = self.request.query_params.get("category_type")
        min_amount = self.request.query_params.get("min_amount")
        max_amount = self.request.query_params.get("max_amount")
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

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

        return queryset.order_by("-date")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        search = request.query_params.get("search")
        queryset = self.get_queryset()
        if search:
            queryset = queryset.filter(category__name__icontains=search)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(
            {
                "status": "success",
                "message": "Transactions fetched successfully.",
                "data": serializer.data,
            }
        )


# ---------------- Budget ----------------
class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PaginationClass

    def get_queryset(self):
        queryset = Budget.objects.filter(user=self.request.user)
        month = self.request.query_params.get("month")
        year = self.request.query_params.get("year")

        if month and year:
            queryset = queryset.filter(month=month,year=year)

        return queryset.order_by("-year", "-month")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "status": "success",
                    "message": "Budget created successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "status": "error",
                "message": "Budget creation failed.",
                "data": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {
                    "status": "error",
                    "message": "You are not allowed to update this budget.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "status": "success",
                "message": "Budget updated successfully.",
                "data": serializer.data,
            }
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {
                    "status": "error",
                    "message": "You are not allowed to delete this budget.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        instance.delete()
        return Response(
            {"status": "success", "message": "Budget deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


# ---------------- Dashboard ----------------
class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # ---- Query Params ----
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        search = request.query_params.get('search')
        sort_by = request.query_params.get('sort_by', 'date')  # date | amount | category
        order = request.query_params.get('order', 'desc')       # asc | desc
        export = request.query_params.get('export')             # csv | json

        # ---- Base Query ----
        txns = Transaction.objects.filter(user=user)

        if month:
            txns = txns.filter(date__month=month)
        if year:
            txns = txns.filter(date__year=year)
        if search:
            txns = txns.filter(
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )

        # ---- Sorting ----
        sort_field_map = {
            "amount": "amount",
            "date": "date",
            "category": "category__name"
        }
        sort_field = sort_field_map.get(sort_by, "date")
        if order == "desc":
            sort_field = f"-{sort_field}"
        txns = txns.order_by(sort_field)

        # ---- Aggregations ----
        total_income = txns.filter(category__type='income').aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = txns.filter(category__type='expense').aggregate(total=Sum('amount'))['total'] or 0
        balance = total_income - total_expenses

        # ---- Category Summary ----
        category_summary = (
            txns.filter(category__type='expense')
            .values('category__name')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        # ---- Budget Comparison ----
        current_month = month or datetime.now().month
        current_year = year or datetime.now().year
        budget = Budget.objects.filter(user=user, month=current_month, year=current_year).first()
        budget_amount = budget.amount if budget else 0

        budget_utilized = (total_expenses / budget_amount * 100) if budget_amount > 0 else 0
        budget_status = (
            "under_budget" if total_expenses <= budget_amount
            else "over_budget"
        ) if budget_amount > 0 else "no_budget_set"

        # ---- Transaction Stats ----
        txn_data = list(
            txns.values('id', 'category__name', 'category__type', 'amount', 'date', 'description')
        )
        txn_count = len(txn_data)

        daily_expense = (
            txns.filter(category__type='expense')
            .values('date')
            .annotate(total=Sum('amount'))
            .order_by('date')
        )

        # ---- Export (CSV / JSON) ----
        if export == "csv":
            buffer = io.StringIO()
            writer = csv.writer(buffer)
            writer.writerow(["ID", "Category", "Type", "Amount", "Date", "Description"])
            for t in txn_data:
                writer.writerow([
                    t['id'],
                    t['category__name'],
                    t['category__type'],
                    t['amount'],
                    t['date'],
                    t['description']
                ])
            buffer.seek(0)
            response = HttpResponse(buffer, content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="dashboard_{user.username}.csv"'
            return response

        elif export == "json":
            response = HttpResponse(
                json.dumps(txn_data, indent=2, default=str),
                content_type="application/json"
            )
            response['Content-Disposition'] = f'attachment; filename="dashboard_{user.username}.json"'
            return response

        # ---- Normal JSON Response ----
        return Response({
            "status": "success",
            "message": "Dashboard summary fetched successfully.",
            "filters": {
                "month": month,
                "year": year,
                "search": search,
                "sort_by": sort_by,
                "order": order,
            },
            "data": {
                "total_income": total_income,
                "total_expenses": total_expenses,
                "balance": balance,
                "transaction_count": txn_count,
                "budget_amount": budget_amount,
                "budget_utilized_percent": round(budget_utilized, 2),
                "budget_status": budget_status,
                "category_summary": list(category_summary),
                "daily_expense_trend": list(daily_expense),
                "transactions": txn_data[:20],  # first 20 for dashboard preview
            }
        })