package db

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type BakeSales struct {
	Date   time.Time `bson:"date"`
	Amount int       `bson:"amount"`
}

// 物化视图测试
func Views(collection *mongo.Collection) {
	info, err := collection.Aggregate(context.TODO(), []bson.M{
		{"$match": bson.M{"amount": bson.M{"$gte": 6}}},
		{"$group": bson.M{"_id": "$date", "number": bson.M{"$sum": "$amount"}}},
		{"$merge": bson.M{"into": "testbake", "whenMatched": "replace"}},
	})
	if err != nil {
		fmt.Println("创建物化视图失败")
		fmt.Println(err)
	}
	fmt.Println(info.Current)
	fmt.Println(info.ID())
}

func OnDemandTest() {
	collection := db.Collection("bakesales")
	// var list []interface{}
	// for i := 0; i < 2; i++ {
	// 	temp := BakeSales{
	// 		Date:   time.Now(),
	// 		Amount: 50 + i,
	// 	}
	// 	list = append(list, temp)
	// }
	// many, err := collection.InsertMany(context.TODO(), list)
	// if err != nil {
	// 	fmt.Println("插入数据失败")
	// 	fmt.Println(err)
	// }
	// fmt.Println(many.InsertedIDs...)
	Views(collection)
}
