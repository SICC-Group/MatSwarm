package db

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

//mongodb中query的结构体
type QueryTable struct {
	Id      primitive.ObjectID  `bson:"_id"`
	Data    []DataOfCategoryRes `bson:"data"`  // 检索数据
	Value   string              `bson:"value"` // 检索字段
	Summary Summary             `bson:"summary"`
	Total   int                 `bson:"total"`
}

// 新增一条Query数据
func AddQueryData(t *QueryTable) string {
	collection := db.Collection("query")
	id := primitive.NewObjectID()
	t.Id = id
	objId, err := collection.InsertOne(context.TODO(), &t)
	if err != nil {
		log.Println(err)
		return ""
	}
	log.Println("录入query数据成功，objId:", t.Id.Hex())
	log.Println(objId)
	return t.Id.Hex()
}

func GetQueryDataByID(id string) QueryTable {
	var res QueryTable
	collection := db.Collection("query")
	objId, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": bson.M{"$eq": objId}}
	err := collection.FindOne(context.Background(), filter).Decode(&res)
	if err != nil {
		log.Println(err)
	}
	return res
}

func EditQueryData(t *QueryTable, id string) {
	collection := db.Collection("query")
	objId, _ := primitive.ObjectIDFromHex(id)
	t.Id = objId
	update := bson.M{"$set": t}
	updateResult, err := collection.UpdateOne(context.Background(), bson.M{"_id": objId}, update)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("collection.UpdateOne:", updateResult)
}
