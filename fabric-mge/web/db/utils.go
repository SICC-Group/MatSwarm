package db

import (
	"fmt"

	"github.com/go-ego/gse"
)

// 数据内容分词 https://github.com/go-ego/gse/blob/master/README_zh.md
func SliceKeyWords(text string) []string {
	var (
		seg gse.Segmenter
	)

	// Skip log print
	seg.SkipLog = true

	// load default dict
	err := seg.LoadDict()
	if err != nil {
		panic("segment error")
	}

	fmt.Println(len(seg.Slice(text, true)))
	return seg.Slice(text, true)
}
