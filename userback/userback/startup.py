from django.core.management import call_command
from django.db import connections
from django.db.utils import OperationalError

def run_migrations_once():
    try:
        db_conn = connections["default"]
        db_conn.ensure_connection()
    except OperationalError:
        return  # DB not ready yet

    try:
        call_command("migrate", interactive=False, verbosity=0)
        print("✅ Database migrations ensured")
    except Exception as e:
        print("⚠️ Migration skipped:", e)
