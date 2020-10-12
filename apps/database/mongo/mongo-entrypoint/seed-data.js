print("===============JAVASCRIPT===============")
print("Count of rows in stator collection: " + db.stator.count())

db.stator.insert({ message: "Testing data is preserved on docker-compose down and docker-compose-up" })

print("===============AFTER JS INSERT==========")
print("Count of rows in stator collection: " + db.stator.count())

statorData = db.stator.find()
while (statorData.hasNext()) {
  printjson(statorData.next())
}
