package db

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// 测试数据结构体
type Test struct {
	Id    string `bson:"_id"`
	Name  string `bson:"name"`
	Level int    `bson:"level"`
}

var db *mongo.Database // database 话柄

//1、pool连接池模式
func ConnectToDB(uri, name string, timeout time.Duration) (*mongo.Database, error) {
	// 设置连接超时时间
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()
	// 通过传进来的uri连接相关的配置
	o := options.Client().ApplyURI(uri)
	// 发起链接
	client, err := mongo.Connect(ctx, o)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	// 判断服务是不是可用
	if err = client.Ping(context.Background(), readpref.Primary()); err != nil {
		log.Fatal(err)
		return nil, err
	}
	// 返回 client
	return client.Database(name), nil
}

//2、新增一条数据（例）
func AddData(t *Test, collection *mongo.Collection) {
	objId, err := collection.InsertOne(context.TODO(), &t)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("录入数据成功，objId:", objId)
}

//3、通用删除一条数据
func Del(m bson.M, collection *mongo.Collection) {
	deleteResult, err := collection.DeleteOne(context.Background(), m)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("collection.DeleteOne:", deleteResult)
}

//4、编辑一条数据（例）
func EditOne(t *Test, m bson.M, collection *mongo.Collection) {
	update := bson.M{"$set": t}
	updateResult, err := collection.UpdateOne(context.Background(), m, update)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("collection.UpdateOne:", updateResult)
}

//5、更新数据 - 存在更新，不存在就新增（例）
func Update(t *Test, m bson.M, collection *mongo.Collection) {
	update := bson.M{"$set": t}
	updateOpts := options.Update().SetUpsert(true)
	updateResult, err := collection.UpdateOne(context.Background(), m, update, updateOpts)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("collection.UpdateOne:", updateResult)
}

//6、通用模糊查询
func Sectle(m bson.M, collection *mongo.Collection) {
	cur, err := collection.Find(context.Background(), m)
	if err != nil {
		log.Fatal(err)
	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	for cur.Next(context.Background()) {
		var t Test
		if err = cur.Decode(&t); err != nil {
			log.Fatal(err)
		}
		log.Println("collection.Find name=primitive.Regex{xx}: ", t)
	}
	_ = cur.Close(context.Background())
}

//7、准确搜索一条数据（参考）
func GetOne(m bson.M, collection *mongo.Collection) {
	var one Test
	err := collection.FindOne(context.Background(), m).Decode(&one)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("collection.FindOne: ", one)
}

//8、获取多条数据
func GetList(m bson.M, collection *mongo.Collection) {
	cur, err := collection.Find(context.Background(), m)
	if err != nil {
		log.Fatal(err)
	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}
	var all []*Test
	err = cur.All(context.Background(), &all)
	if err != nil {
		log.Fatal(err)
	}
	_ = cur.Close(context.Background())

	log.Println("collection.Find curl.All: ", all)
	for _, one := range all {
		log.Println("Id:", one.Id, " - name:", one.Name, " - level:", one.Level)
	}
}

//9、统计collection的数据总数
func Count(collection *mongo.Collection) {
	count, err := collection.CountDocuments(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(count)
	}
	log.Println("collection.CountDocuments:", count)
}

func MongoInit() *mongo.Database {
	uri := "mongodb://localhost:27017"
	name := "MGE"
	maxTime := time.Duration(2) // 链接超时时间
	var err error
	db, err = ConnectToDB(uri, name, maxTime)
	if err != nil {
		panic("链接数据库有误!")
	}
	return db
}
