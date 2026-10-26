from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'goals', views.FinancialGoalViewSet, basename='goal')

urlpatterns = [
    path('health/', views.health),
    path('dashboard/overview/', views.dashboard_overview),
    path('expenses/analysis/', views.expense_analysis),
    path('ai/chat/', views.ai_chat),
    path('', include(router.urls)),
]
