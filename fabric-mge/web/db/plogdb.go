package db

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PLogTable struct {
	Id        primitive.ObjectID `bson:"_id"`
	LogTime   time.Time          `bson:"logtime"`
	EventName string             `bson:"eventName"`
	Host      string             `bson:"host"`
	Pmethod   string             `bson:"pmethod"`
	Url       string             `bson:"url"`
}

type PLogTable1 struct {
	Id        primitive.ObjectID `bson:"_id"`
	LogTime   time.Time          `bson:"logtime"`
	EventName string             `bson:"eventName"`
	Host      string             `bson:"host"`
	Pmethod   string             `bson:"pmethod"`
	Url       string             `bson:"url"`
}

func PAddLogData(t *PLogTable) {
	logres := PLogTable{
		Id:        primitive.NewObjectID(),
		LogTime:   time.Now(),
		EventName: t.EventName,
		Host:      t.Host,
		Pmethod:   t.Pmethod,
		Url:       t.Url,
	}
	collection := db.Collection("log")
	// _, err := collection.InsertOne(context.TODO(), &logres)
	// if err != nil {
	// 	log.Println(err)
	// 	return
	// }
	// log.Println(logres)

	update := bson.M{"$set": bson.M{"plogtable": logres}}

	var res LogItem
	// err := collection.FindOne(context.Background(), bson.M{"_id": bson.M{"$eq": logres.LogTime.Format("2006-01-02 15:04:05")}}).Decode(&res)
	err := collection.FindOne(context.TODO(), bson.M{"time": logres.LogTime.Format("2006-01-02 15:04:05")}).Decode(&res)
	if err != nil {
		fmt.Println(err)
		CreateEmptyTable()
		_, err := collection.UpdateOne(context.Background(), bson.M{"time": logres.LogTime.Format("2006-01-02 15:04:05")}, update)
		if err != nil {
			log.Fatal(err)
		}
		log.Println("创建空表单后录入来自web服务器的日志信息成功")
	} else {
		_, err := collection.UpdateOne(context.Background(), bson.M{"time": logres.LogTime.Format("2006-01-02 15:04:05")}, update)
		if err != nil {
			log.Fatal(err)
		}
		log.Println("录入来自web服务器的日志信息成功")
	}
	// fmt.Println(res)
	// _, err := collection.UpdateOne(context.Background(), bson.M{"time": logres.LogTime.Format("2006-01-02 15:04:05")}, update)
	// log.Println("logres",logres)
	// if err != nil {
	// 	log.Fatal(err)
	// 	CreateEmptyTable()
	// 	_, err := collection.UpdateOne(context.Background(), bson.M{"time": logres.LogTime.Format("2006-01-02 15:04:05")}, update)
	// 	if err != nil {
	// 		log.Fatal(err)
	// 		return
	// 	}
	// 	fmt.Println("创建空表单后录入来自web服务器的日志信息成功")
	// }
	// log.Println("录入来自web服务器的日志信息成功")
}
func PGetLogDataById(id string) PLogTable {
	collection := db.Collection("log")
	var res PLogTable
	objId, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": bson.M{"$eq": objId}}
	err := collection.FindOne(context.Background(), filter).Decode(&res)
	if err != nil {
		log.Fatal(err)
	}
	return res
}
