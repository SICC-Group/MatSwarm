package db

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

type TemplateTable struct {
	Id          int       `bson:"_id"`
	Title       string    `bson:"title"`
	Category    string    `bson:"category"`
	Category_id int       `bson:"categoryId"`
	Abstract    string    `bson:"abstract_"`
	PubDate     time.Time `bson:"pubDate"`
	Published   bool      `bson:"published"`
	Content     string    `bson:"content"`
	ReviewState int       `bson:"reviewState"`
	Reviewer    string    `bson:"reviewer"`
	Author      string    `bson:"author"`
	Refcount    int       `bson:"refCount"`
	Method      int       `bson:"method"`
}

// type Content struct{

// }

// type TemplateTable struct {
// 	Id          int       `bson:"_id"`
// 	Title       string    `bson:"title"`
// 	Category    string    `bson:"category"`
// 	Category_id int       `bson:"categoryId"`
// 	Abstract    string    `bson:"abstract_"`
// 	PubDate     time.Time `bson:"pubDate"`
// 	Published   bool      `bson:"published"`
// 	Content     Content    `bson:"content"`
// 	ReviewState int       `bson:"reviewState"`
// 	Reviewer    string    `bson:"reviewer"`
// 	Author      string    `bson:"author"`
// 	Refcount    int       `bson:"refCount"`
// 	Method      int       `bson:"method"`
// }

func GetTemplateById(id int) TemplateTable {
	collection := db.Collection("template")
	var res TemplateTable
	err := collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&res)
	if err != nil {
		log.Fatal(err)
	}
	return res
}

func AddTemplate(t *TemplateTable) {
	collection := db.Collection("Template")
	objId, err := collection.InsertOne(context.TODO(), &t)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("录入数据成功，objId:", objId)
}
