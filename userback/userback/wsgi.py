import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'userback.settings')

application = get_wsgi_application()
from userback.startup import run_migrations_once
run_migrations_once()