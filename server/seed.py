#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db,Inventory,Convention,User,Sale
fake = Faker()
with app.app_context():
    inventorys = []
    for n in range(5):
        inventory = Inventory(name=fake.first_name(), price=randint(1, 50), quantity=randint(0, 50))
        inventorys.append(inventory)

    users = []
    for n in range(5):
        user = User(username=fake.name(),password=fake.country(),name=fake.name())
        users.append(user)
    
    conventions = []
    for n in range(5):
        convention = Convention(name=fake.first_name(),num_of_days = randint(1,6),table_cost=randint(1,1500))
        conventions.append(convention)

    print("Clearing out table!")
    Inventory.query.delete()
    User.query.delete()
    Convention.query.delete()
    print("Seeding Inventory...")
    db.session.add_all(inventorys)  # Use add_all to add the list of Inventory objects
    db.session.add_all(users)
    db.session.add_all(conventions)
    db.session.commit()

    print("Done Seeding!")