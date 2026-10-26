from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from decimal import Decimal
from datetime import date, timedelta
from collections import defaultdict
import json

from .models import Transaction, FinancialGoal
from .serializers import TransactionSerializer, FinancialGoalSerializer


# ── Health ────────────────────────────────────────────────────────────────────
@api_view(['GET'])
def health(request):
    return Response({'status': 'ok', 'service': 'FINVERSE AI Backend', 'version': '1.0.0'})


# ── Dashboard Overview ────────────────────────────────────────────────────────
@api_view(['GET'])
def dashboard_overview(request):
    # Get current month transactions
    today = date.today()
    first_day = today.replace(day=1)

    txs = Transaction.objects.filter(date__gte=first_day)
    all_txs = Transaction.objects.all()

    income = sum(float(t.amount) for t in txs if t.type == 'income')
    expenses = sum(float(t.amount) for t in txs if t.type == 'expense')
    cash_flow = income - expenses
    savings_rate = round((cash_flow / income * 100), 1) if income > 0 else 0

    # Health score (simple heuristic)
    score = 0
    if savings_rate >= 20: score += 30
    elif savings_rate >= 10: score += 15
    if income > 0: score += 20
    if expenses < income: score += 20
    score += min(30, int(savings_rate * 0.6))
    score = min(100, max(0, score))

    if score >= 76: health_label = 'Financially Secure'
    elif score >= 51: health_label = 'Financially Growing'
    elif score >= 26: health_label = 'Building Stability'
    else: health_label = 'Starting Out'

    # Expense categories breakdown
    cats = defaultdict(float)
    COLORS = {
        'Housing': '#795548', 'Food': '#C6A15B', 'Transport': '#7C9274',
        'Utilities': '#D8C3A5', 'Entertainment': '#C47B63', 'Health': '#EDE2D0',
        'Education': '#78675B', 'Other': '#3B2A24',
    }
    for t in txs.filter(type='expense'):
        cats[t.category] += float(t.amount)

    expense_categories = [
        {'name': k, 'value': round(v, 2), 'color': COLORS.get(k, '#795548')}
        for k, v in cats.items()
    ]

    # Monthly chart (last 6 months)
    monthly = []
    for i in range(5, -1, -1):
        d = (today.replace(day=1) - timedelta(days=i * 28)).replace(day=1)
        month_txs = all_txs.filter(date__year=d.year, date__month=d.month)
        monthly.append({
            'month': d.strftime('%b'),
            'income': float(sum(t.amount for t in month_txs if t.type == 'income')),
            'expenses': float(sum(t.amount for t in month_txs if t.type == 'expense')),
        })

    return Response({
        'monthly_income': income,
        'total_expenses': expenses,
        'cash_flow': cash_flow,
        'savings_rate': savings_rate,
        'health_score': score,
        'health_label': health_label,
        'expense_categories': expense_categories,
        'monthly_chart': monthly,
    })


# ── Transactions ──────────────────────────────────────────────────────────────
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        tx_type = self.request.query_params.get('type')
        if category:
            qs = qs.filter(category=category)
        if tx_type:
            qs = qs.filter(type=tx_type)
        return qs


# ── Expense Analysis ──────────────────────────────────────────────────────────
@api_view(['GET'])
def expense_analysis(request):
    txs = Transaction.objects.filter(type='expense')
    cats = defaultdict(float)
    for t in txs:
        cats[t.category] += float(t.amount)

    ESSENTIAL = {'Housing', 'Utilities', 'Health'}
    REVIEW_THRESHOLD = 300

    insights = []
    for cat, amount in cats.items():
        if cat in ESSENTIAL:
            classification = 'essential'
            reason = f'{cat} is a fundamental living expense.'
            suggestion = 'Ensure you\'re getting the best value for this essential.'
            savings = None
        elif amount > REVIEW_THRESHOLD:
            classification = 'review'
            reason = f'Your {cat} spending of ${amount:.0f}/month is above average. Worth reviewing.'
            suggestion = f'Audit {cat.lower()} expenses for redundancy or better alternatives.'
            savings = round(amount * 0.15, 2)
        else:
            classification = 'flexible'
            reason = f'{cat} spending appears reasonable and manageable.'
            suggestion = 'Continue monitoring — meal planning or bulk buying could help.'
            savings = round(amount * 0.1, 2) if amount > 100 else None

        insights.append({
            'category': cat, 'amount': round(amount, 2),
            'classification': classification, 'reason': reason,
            'suggestion': suggestion, 'savings': savings,
        })

    return Response(insights)


# ── Goals ─────────────────────────────────────────────────────────────────────
class FinancialGoalViewSet(viewsets.ModelViewSet):
    queryset = FinancialGoal.objects.all()
    serializer_class = FinancialGoalSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']


# ── AI Chat ───────────────────────────────────────────────────────────────────
DEMO_AI_RESPONSES = {
    'reduce': "Here are effective ways to reduce your monthly expenses:\n\n1. **Audit subscriptions** — Cancel services you haven't used in 30+ days.\n2. **Meal planning** — Preparing meals at home can save $150–400/month.\n3. **Utility optimization** — Small habit changes can reduce bills by 15–20%.\n4. **Transport review** — Mix public transport with personal vehicle use.\n5. **The 24-hour rule** — Wait before non-essential purchases over $50.\n\nYour spending data shows the most potential savings in Food and Entertainment categories.",
    'budget': "I'll help you build a budget using the 50/30/20 framework:\n\n**50% Needs** — Rent, utilities, groceries, insurance\n**30% Wants** — Entertainment, dining, hobbies\n**20% Savings** — Emergency fund, investments\n\nBased on your transaction data, your savings rate looks strong! Would you like me to suggest specific category limits?",
    'emergency': "Building an emergency fund is critical. Here's your roadmap:\n\n1. Set target: 3–6 months of essential expenses\n2. Open a high-yield savings account (4–5% APY)\n3. Automate transfers on payday\n4. Keep it separate from your checking account\n\nDon't use it for non-emergencies — define what qualifies upfront.",
    'invest': "Investment options for beginners, from lower to higher risk:\n\n🔵 **Low risk**: High-yield savings (4–5% APY), T-bills, CDs\n🟡 **Moderate**: Index funds (S&P 500 ETFs), target-date funds\n🔴 **Higher**: Individual stocks, REITs\n\nRecommended sequence: Emergency fund → Max Roth IRA → Index funds (VTI/VOO)\n\n⚠️ This is general education, not personalised investment advice. Consult a licensed financial advisor.",
}

def get_ai_demo_response(message):
    m = message.lower()
    if any(w in m for w in ['reduc', 'cut', 'lower', 'less', 'save money']): return DEMO_AI_RESPONSES['reduce']
    if 'budget' in m: return DEMO_AI_RESPONSES['budget']
    if 'emergency' in m: return DEMO_AI_RESPONSES['emergency']
    if any(w in m for w in ['invest', 'stock', 'fund', 'beginner', 'portfolio']): return DEMO_AI_RESPONSES['invest']
    return "I can help with budgeting, saving, investing basics, and understanding your spending patterns. What would you like to explore?\n\n(Running in demo mode — connect a Groq API key for full AI responses.)"


def search_serpapi(query, api_key):
    """Fetch live web search context using SerpAPI."""
    if not api_key:
        return None
    try:
        import requests
        params = {
            'engine': 'google',
            'q': query,
            'api_key': api_key,
            'num': 4,
            'hl': 'en',
            'gl': 'us',
        }
        res = requests.get('https://serpapi.com/search.json', params=params, timeout=7)
        if res.status_code == 200:
            data = res.json()
            snippets = []
            
            # Answer box or direct knowledge
            if 'answer_box' in data:
                ab = data['answer_box']
                text = ab.get('answer') or ab.get('snippet') or ab.get('result') or ''
                if text:
                    snippets.append(f"Direct Fact: {text}")
            elif 'knowledge_graph' in data:
                kg = data['knowledge_graph']
                kg_title = kg.get('title', '')
                kg_desc = kg.get('description', '')
                if kg_desc:
                    snippets.append(f"{kg_title}: {kg_desc}")

            # Top organic search results
            for item in data.get('organic_results', [])[:3]:
                title = item.get('title', '')
                snippet = item.get('snippet', '')
                if snippet:
                    snippets.append(f"• {title}: {snippet}")

            if snippets:
                return "\n".join(snippets)
    except Exception as e:
        import sys
        print(f"[SerpAPI Note]: {e}", file=sys.stderr)
    return None


def call_groq(messages, api_key):
    """Call Groq API using high-performance models."""
    import requests
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }

    # Try fast and powerful Groq models
    models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']
    for model_name in models:
        try:
            payload = {
                'model': model_name,
                'messages': messages,
                'temperature': 0.65,
                'max_tokens': 800,
            }
            res = requests.post(
                'https://api.groq.com/openai/v1/chat/completions',
                json=payload,
                headers=headers,
                timeout=12
            )
            if res.status_code == 200:
                data = res.json()
                return data['choices'][0]['message']['content']
        except Exception:
            continue
    return None


@api_view(['POST'])
def ai_chat(request):
    message = request.data.get('message', '').strip()
    if not message:
        return Response({'error': 'Message is required.'}, status=status.HTTP_400_BAD_REQUEST)

    from django.conf import settings
    groq_key = getattr(settings, 'GROQ_API_KEY', '')
    serpapi_key = getattr(settings, 'SERPAPI_KEY', '')

    # 1. Gather User's Current Financial Snapshot from DB
    try:
        total_income = sum(float(t.amount) for t in Transaction.objects.filter(type='income'))
        total_expenses = sum(float(t.amount) for t in Transaction.objects.filter(type='expense'))
        savings_rate = round(((total_income - total_expenses) / total_income * 100), 1) if total_income > 0 else 0
        user_context = (
            f"User Financial Snapshot: Monthly Income: ${total_income:,.2f}, "
            f"Monthly Expenses: ${total_expenses:,.2f}, Savings Rate: {savings_rate}%."
        )
    except Exception:
        user_context = "User Financial Snapshot: ~$5,800 monthly income, ~$3,420 expenses, 41% savings rate."

    # 2. SerpAPI Search if relevant or requested
    web_context = None
    if serpapi_key:
        search_query = message
        # Optimize query for financial intelligence search
        if any(w in message.lower() for w in ['rate', 'interest', 'inflation', 's&p', 'stock', 'yield', 'hysa', 'today', 'current', 'best']):
            search_query = f"{message} personal finance"
        web_context = search_serpapi(search_query, serpapi_key)

    # 3. Formulate System Prompt
    system_prompt = (
        "You are FINVERSE AI, an elite, warm, and sophisticated personal finance assistant. "
        "Your goal is to provide clear, actionable, and encouraging financial guidance. "
        "Tone: Warm minimalist, knowledgeable, non-judgmental. "
        f"{user_context}\n"
    )

    if web_context:
        system_prompt += (
            f"\n--- Live Web Intelligence (via Google / SerpAPI) ---\n"
            f"{web_context}\n"
            "Use this live information to provide factual, up-to-date answers when helpful.\n"
        )

    system_prompt += (
        "\nGuidelines:\n"
        "• Highlight potential savings and positive cash flow opportunities.\n"
        "• If discussing investments, emphasize low-cost diversification (e.g. index funds, HYSAs).\n"
        "• Never promise or guarantee specific investment returns.\n"
        "• Include a brief disclaimer that this is educational guidance, not formal financial advice."
    )

    # 4. Invoke Groq LLM
    if groq_key:
        messages = [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': message}
        ]
        groq_response = call_groq(messages, groq_key)
        if groq_response:
            source = 'groq+serpapi' if web_context else 'groq'
            return Response({
                'response': groq_response,
                'source': source,
                'has_web_sources': bool(web_context)
            })

    # 5. Fallback Demo Response if API offline
    response = get_ai_demo_response(message)
    return Response({
        'response': response,
        'source': 'demo',
        'note': 'Demo response — offline educational mode active.'
    })
