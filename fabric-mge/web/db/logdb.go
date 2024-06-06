package db

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LogTable struct {
	Id        primitive.ObjectID `bson:"_id"`
	LogTime   time.Time          `bson:"logtime"`
	EventName string             `bson:"eventName"`
	EventId   string             `bson:"eventId"`
	SourceUrl string             `bson:"sourceUrl"`
	TxId      string             `bson:"txId"`
	DataId    string             `bson:"dataId"`
}

type LogItem struct {
	Id        primitive.ObjectID `bson:"_id"`
	LogTable  LogTable           `bson:"logtable"`
	PLogTable PLogTable          `bson:"plogtable"`
	Time      string             `bson:"time"`
	DataId    string             `bson:"dataId"`
}

func CreateEmptyTable() {
	LogItem := LogItem{
		Id:   primitive.NewObjectID(),
		Time: time.Now().Format("2006-01-02 15:04:05"),
	}
	collection := db.Collection("log")
	_, err := collection.InsertOne(context.TODO(), &LogItem)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("创建空表格成功")
}

func AddLogData(t *LogTable) {
	id := primitive.NewObjectID()
	t.Id = id
	LogItem := LogItem{
		Id:       primitive.NewObjectID(),
		LogTable: *t,
		Time:     t.LogTime.Format("2006-01-02 15:04:05"),
		DataId:   t.DataId,
	}

	collection := db.Collection("log")
	objId, err := collection.InsertOne(context.TODO(), &LogItem)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("录入mge 区块链log数据成功，objId:", objId)
}
func GetLogDataById(id string) LogItem {
	collection := db.Collection("log")
	var res LogItem
	objId, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": bson.M{"$eq": objId}}
	err := collection.FindOne(context.Background(), filter).Decode(&res)
	if err != nil {
		log.Fatal(err)
	}
	return res
}

func GetLogDataByDataId(id string) LogItem {
	collection := db.Collection("log")
	var res LogItem
	filter := bson.M{"dataId": bson.M{"$eq": id}}
	err := collection.FindOne(context.Background(), filter).Decode(&res)
	if err != nil {
		log.Fatal(err)
	}
	return res
}

func GetLogData() []LogItem {
	collection := db.Collection("log")
	var res LogItem
	var results []LogItem
	filter := bson.M{}
	cur, err := collection.Find(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	log.Println(cur)
	for cur.Next(context.Background()) {
		if err = cur.Decode(&res); err != nil {
			log.Fatal(err)
		}
		results = append(results, res)
	}
	_ = cur.Close(context.Background())
	return results
}
