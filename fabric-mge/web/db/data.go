package db

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DataTable struct {
	Id                  primitive.ObjectID `bson:"_id"`
	Title               string             `bson:"title"`
	CategoryId          int                `bson:"categoryId"`
	Category            string             `bson:"category"`
	Template            TemplateTable      `bson:"template"`
	Keywords            []string           `bson:"keywords"`
	Methods             []string           `bson:"methods"`
	Abstract            string             `bson:"abstract_"`
	Author              string             `bson:"author"`
	AddTime             time.Time          `bson:"addTime"`
	Project             string             `bson:"project"`
	Subject             string             `bson:"subject"`
	Approved            bool               `bson:"approved"`
	PublicRange         string             `bson:"publicRange"`
	Contributor         string             `bson:"contributor"`
	Reference           string             `bson:"reference"`
	Reviewer            string             `bson:"reviewer"`
	ReviewerIns         string             `bson:"reviewerIns"`
	PublicDate          time.Time          `bson:"publicDate"`
	PlatformBelong      string             `bson:"platformBelong"`
	ReviewState         int                `bson:"reviewState"`
	UploaderInstitution string             `bson:"uploaderInstitution"`
	Doi                 string             `bson:"doi"`
	Purpose             string             `bson:"purpose"`
	Source              string             `bson:"source"`
	DataSetRefCount     int                `bson:"dataSetRefCount"`
	Content             string             `bson:"content"`
	Score               int                `bson:"score"`
	Downloads           int                `bson:"downloads"`
	Views               int                `bson:"views"`
	ExternalLink        []string           `bson:"externalLink"`
	IsDone              bool               `bson:"isDone"`
}

func AddMgeData(t *DataTable) {
	id := primitive.NewObjectID()
	t.Id = id
	collection := db.Collection("data")
	objId, err := collection.InsertOne(context.TODO(), &t)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("录入mge data数据成功，objId:", objId)
}

func GetDataById(id string) DataTable {
	collection := db.Collection("data")
	var res DataTable
	objId, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": bson.M{"$eq": objId}}
	err := collection.FindOne(context.Background(), filter).Decode(&res)
	if err != nil {
		log.Fatal(err)
	}
	return res
}
