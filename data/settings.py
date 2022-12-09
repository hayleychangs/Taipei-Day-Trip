import os
from dotenv import load_dotenv

load_dotenv()

host=os.getenv("DB_host")
port=os.getenv("DB_port")
database=os.getenv("DB_database")
user=os.getenv("DB_user")
password=os.getenv("DB_password")

secretkey=os.getenv("key")