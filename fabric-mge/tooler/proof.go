package tooler

import (
	"fmt"
)

type Proof interface {
	// Put inserts the given value into the key-value data store.
	Put(key []byte, value []byte) error

	// Delete removes the key from the key-value data store.
	Delete(key []byte) error

	// Has retrieves if a key is present in the key-value data store.
	Has(key []byte) (bool, error)

	// Get retrieves the given key if it's present in the key-value data store.
	Get(key []byte) ([]byte, error)

	// Serialize returns the serialized proof
	Serialize() [][]byte
}

type ProofDB struct {
	KV map[string][]byte
}

func NewProofDB() *ProofDB {
	return &ProofDB{
		KV: make(map[string][]byte),
	}
}

func (w *ProofDB) Put(key []byte, value []byte) error {
	keyS := fmt.Sprintf("%x", key)
	w.KV[keyS] = value
	// fmt.Printf("put key: %x, value: %x\n", key, value)
	return nil
}

func (w *ProofDB) Delete(key []byte) error {
	keyS := fmt.Sprintf("%x", key)
	delete(w.KV, keyS)
	return nil
}
func (w *ProofDB) Has(key []byte) (bool, error) {
	keyS := fmt.Sprintf("%x", key)
	_, ok := w.KV[keyS]
	return ok, nil
}

func (w *ProofDB) Get(key []byte) ([]byte, error) {
	keyS := fmt.Sprintf("%x", key)
	val, ok := w.KV[keyS]
	if !ok {
		return nil, fmt.Errorf("not found")
	}
	return val, nil
}

func (w *ProofDB) Serialize() [][]byte {
	nodes := make([][]byte, 0, len(w.KV))
	for _, value := range w.KV {
		nodes = append(nodes, value)
	}
	return nodes
}
