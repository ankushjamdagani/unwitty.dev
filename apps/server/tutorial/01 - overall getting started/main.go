package main

import (
	"errors"
	"fmt"
	"math/rand"

	// "math/rand"
	"strings"
	"sync"
	"time"
	"unicode/utf8"
)

func main() {
	fmt.Println("Hello world!")

	// No hoisting in block scope
	abc := 12
	fmt.Println(abc, &abc) // 12
	{
		fmt.Println(abc, &abc) // 12
		abc := 134
		fmt.Println(abc, &abc) // 134
	}
	fmt.Println(abc, &abc) // 12

	// ----------------- Data Types ----------------------
	dataType()

	// ----------------- Functions and Control Structures ----------------------
	controlStructures()

	// ----------------- Arrays and Maps ----------------------
	arraysAndMaps()

	// ----------------- String, Runes and String builders ----------------------
	stringsPrunesAndBuilders()

	fmt.Println("----------------- Structs and Interfaces ----------------------")
	structsAndInterfaces()

	fmt.Println("----------------- Pointers ----------------------")
	pointers()

	fmt.Println("----------------- Go routines ----------------------")
	goRoutines()

	fmt.Println("----------------- Channels ----------------------")
	channels()
	channelsExample()

	fmt.Println("----------------- Generics ----------------------")
	generics()
}

func dataType() {
	var num int8 = 127
	// Compiler won't throw overflow errors at runtime
	num = num + 1 // outputs -128

	var rgb uint8 = 255

	var fNum float64 = 12345678.9
	// for float32 - 12345679.0
	// for float64 - 12345678.9

	var str string = "test"
	str += " string"
	str += `
		multi
		line 
		string

	`
	// --- Length of string
	fmt.Println(len("str")) // len - number of bytes
	fmt.Println(len("Á"))   // len - unicode characters will take more bytes and 6hence wrong value for length of string
	fmt.Println(utf8.RuneCountInString("A"))
	fmt.Println(utf8.RuneCountInString("Á"))

	var flag bool = true

	fmt.Println(num, rgb, fNum, str, flag, num*int8(fNum), fNum*float64(num), 5/2, 5%2)

	// --- Shorthand and inferred types
	num1, flag2 := 12, true
	fmt.Println(num1, flag2)

	// --- Constants
	const FLAG_NAME = "const value"
	const PI = 3.1428
	fmt.Println(FLAG_NAME, PI)
}

func controlStructures() {
	print("val")

	a := 11
	b := 0
	result, err := div(a, b)
	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Printf("Dividing %v with %v results in %v", a, b, result)
	}

	b = 5
	result, err = div(a, b)
	switch {
	case err != nil:
		fmt.Println(err.Error())
	default:
		fmt.Printf("Dividing %v with %v results in %v \n", a, b, result)
	}

	b = 0
	result, err = div(a, b)
	switch err {
	case nil:
		fmt.Printf("Dividing %v with %v results in %v \n", a, b, result)
	default:
		fmt.Println(err.Error())
	}
}

func arraysAndMaps() {
	// ----------------- Arrays and Slices ----------------------
	var numArr [3]int32
	numArr[0] = 1
	numArr[1] = 2
	numArr[2] = 3
	fmt.Println(numArr)
	fmt.Println(numArr[0])
	fmt.Println(numArr[1:3])
	fmt.Println(numArr[1:])
	fmt.Println(numArr[:2])
	fmt.Println(numArr[:])
	// memory location
	fmt.Println(&numArr)
	fmt.Println(&numArr[0])
	fmt.Println(&numArr[1])
	fmt.Println(&numArr[2])

	var numArr1 [3]int32 = [3]int32{3, 4, 5}
	fmt.Println(numArr1)
	numArr2 := [...]int32{4, 5, 6}
	fmt.Println(numArr2)

	// Slices - wraps array for additional functionalities
	var stringArr []string = []string{"A", "B", "C"}
	fmt.Println(stringArr)
	stringArr = append(stringArr, "B", "C", "D")
	fmt.Println(stringArr)

	stringArr2 := []string{"alpha", "beta"}
	fmt.Println(len(stringArr2), cap(stringArr2), &stringArr2[0])
	stringArr2 = append(stringArr2, "gamma")
	fmt.Println(len(stringArr2), cap(stringArr2), &stringArr2[0])
	stringArr2 = append(stringArr2, "delta")
	fmt.Println(len(stringArr2), cap(stringArr2), &stringArr2[0])

	fmt.Println(append(stringArr, stringArr2...))
	fmt.Println(stringArr)

	// Slices using `make`
	// make - type, length, optional capacity
	boolSlice := make([]bool, 3, 4)
	fmt.Println(len(boolSlice), cap(boolSlice), boolSlice)
	// can still append as much we like
	boolSlice = append(boolSlice, boolSlice...)
	fmt.Println(len(boolSlice), cap(boolSlice), boolSlice)

	// ----------------- Maps ----------------------

	var colors map[string]uint8 = map[string]uint8{"color1": 1, "color2": 127, "color3": 255}
	fmt.Println(colors, colors["color2"])
	delete(colors, "color2")
	// invalid key returns values's type's default value
	fmt.Println(colors, colors["color2"])

	obj2 := make(map[string]uint8)
	fmt.Println(obj2, obj2["random"])
	val, ok := obj2["random"]
	if ok {
		fmt.Println(val)
	} else {
		fmt.Println("invalid key")
	}

	// ----------------- Loops ----------------------

	// no order
	for key, val := range colors {
		fmt.Println("Map Item -", key, val)
	}

	for index, val := range stringArr2 {
		fmt.Println("Array item -", index, val)
	}

	i := 0
	for {
		if i > 9 {
			break
		}
		fmt.Println("For loop", i)
		i++
	}

	j := 0
	for j < 10 {
		fmt.Println("For loop conditional", j)
		j++
	}

	// new block scope for vaiable `j`
	for j := 0; j < 10; j++ {
		fmt.Println("For loop verbose", j)
	}

	n := 1000000

	{
		startTime := time.Now()
		withoutPreallocation := make([]int, 0)
		for j := 0; j < n; j++ {
			withoutPreallocation = append(withoutPreallocation, 1)
		}
		deltaTime := time.Since(startTime)
		fmt.Println("without - Preallocation", deltaTime)
	}

	{
		startTime := time.Now()
		withPreallocation := make([]int, 0, n)
		for j := 0; j < n; j++ {
			withPreallocation = append(withPreallocation, 1)
		}
		deltaTime := time.Since(startTime)
		fmt.Println("with - Preallocation", deltaTime)
	}
}

func stringsPrunesAndBuilders() {
	var str = "rÉSUMÊs"
	var ithChar = str[1]
	fmt.Println("str - ", str, ithChar)
	fmt.Printf("%v - %T \n", str, str)
	fmt.Printf("%v - %T \n", ithChar, ithChar)

	for i, v := range str {
		fmt.Printf("%v value=%v \n", i, v)
	}
	fmt.Println(len(str), "-----------") // it's 9 because É takes 2 bytes storage and rest take 1

	var runeStr = []rune("rÉSUMÊs")
	var runeIthChar = runeStr[1]
	fmt.Println("str - ", runeStr, runeIthChar)
	fmt.Printf("%v - %T \n", runeStr, runeStr)
	fmt.Printf("%v - %T \n", runeIthChar, runeIthChar)

	for i, v := range runeStr {
		fmt.Printf("%v value=%v \n", i, v)
	}
	fmt.Println(len(runeStr)) // it's 9 because É takes 2 bytes storage and rest take 1

	strSlice := []string{"abc", "bcd", "cde", "def"}

	var result string
	var resultStringBuilder strings.Builder

	for _, val := range strSlice {
		// new string created each time
		result += val
		// internally pushed to an array. much faster
		resultStringBuilder.WriteString(val)
	}
	// result[0] = "s" // error
	fmt.Println(result)
	finalString := resultStringBuilder.String()
	fmt.Println(finalString)
}

func print(val string) {
	fmt.Println(val)
}

func div(numerator int, denominator int) (int, error) {
	var err error
	if denominator == 0 {
		err = errors.New("cant divide by zero")
		return 0, err
	}

	result := numerator / denominator
	return result, err
}

type point struct {
	x int
	y int
}

type point3D struct {
	x int
	y int
	z int
}

type shape struct {
	shapeType string
	position  point
}

func (s shape) print() {
	fmt.Printf("Shape \"%v\" is positioned at (%v, %v)\n", s.shapeType, s.position.x, s.position.y)
}

type shape3D struct {
	shapeType string
	position  point3D
}

func (s shape3D) print() {
	fmt.Printf("3D Shape \"%v\" is positioned at (%v, %v, %v)\n", s.shapeType, s.position.x, s.position.y, s.position.z)
}

type shapeV2 struct {
	shapeType string
	int
	point
}

type shapeXD interface {
	print()
}

func describeShape(s shapeXD) {
	s.print()
}

func structsAndInterfaces() {
	var pt1 point
	fmt.Println(pt1)

	pt2 := point{x: 10, y: 20}
	fmt.Println(pt2)

	pt3 := point{10, 20} // order is maintained as per type declaration
	pt3.y += 2
	fmt.Println(pt3)

	circle := shape{"circle", pt3}
	fmt.Println(circle, circle.position.x)

	// extend structs
	circleV2 := shapeV2{"circle", 12, point{1, 2}}
	fmt.Println(circleV2)

	// anonymous structs
	anomS := struct {
		message string
	}{message: "I am not reusable"}
	fmt.Println(anomS)

	sq := shape{"square", point{1, 2}}
	sq.print()

	cube := shape3D{"cube", point3D{1, 2, 3}}
	cube.print()

	describeShape(sq)
	describeShape(cube)

	var test shapeXD
	fmt.Println(test)
	fmt.Println(nil)
}

func pointers() {
	var i1 int = 12
	var i2 *int = &i1
	var i3 int = i1
	fmt.Printf("i1 - %v and i2 - %v and i3 - %v\n", i1, *i2, i3)

	*i2 = 32
	i3++
	fmt.Printf("i1 - %v and i2 - %v and i3 - %v\n", i1, *i2, i3)

	slice := []int{1, 2, 3}
	slice2 := slice
	slice2[2] = 24

	fmt.Printf("slice - %v and slice2 - %v\n", slice, slice2)

	fmt.Printf("before square slice - %v\n", slice)
	squareSlice(slice)
	fmt.Printf("before square slice - %v\n", slice)

	numArr := [...]int{4, 5, 6}
	numArr2 := numArr

	numArr2[1] = 24
	fmt.Printf("numArr - %v and numArr2 - %v\n", numArr, numArr2)

	fmt.Printf("before square arr - %v\n", numArr)
	squareArr(&numArr)
	fmt.Printf("before square arr - %v\n", numArr)
}

func squareSlice(slice []int) {
	for i := range slice {
		slice[i] *= 2
	}
}

func squareArr(arr *[3]int) {
	for i := range arr {
		arr[i] *= 2
	}
}

var wg = sync.WaitGroup{}
var mut = sync.RWMutex{}
var result = []string{}
var dbData = []string{"id1", "id2", "id3", "id4", "id5"}

// for concurrent execution
func goRoutines() {
	start := time.Now()

	for _, val := range dbData {
		wg.Add(1)
		go syncCall(val)
	}

	wg.Wait()

	delta := time.Since(start)
	fmt.Println("Total time taken - ", delta)
}

func syncCall(dbId string) {
	// random upto 2 sec
	// var delay float32 = rand.Float32() * 2000
	var delay float32 = 2000

	time.Sleep(time.Duration(delay) * time.Millisecond)
	fmt.Println("Done - ", dbId)

	// blocks all read and write operations
	mut.Lock()
	result = append(result, dbId)
	mut.Unlock()

	// blocks only write operations. any number of reads can occur
	mut.RLock()
	fmt.Println("Current result - ", result)
	mut.RUnlock()

	wg.Done()
}

func channels() {
	var dbChannel = make(chan string, 2)

	go executeProcess(dbChannel)

	// executeProcess can execute sooner with buffered channels
	for val := range dbChannel {
		fmt.Println("Done - ", val)
		time.Sleep(time.Duration(2000) * time.Millisecond)
	}

	fmt.Println("Process logging done")
}

func executeProcess(dbChannel chan string) {
	defer close(dbChannel)

	for _, val := range dbData {
		fmt.Println("Push - ", val)
		time.Sleep(time.Duration(100) * time.Millisecond)

		dbChannel <- val
	}

	fmt.Println("Processes done")
}

const MAX_CHICKEN_PRICE = 5
const MAX_SALAD_PRICE = 5

func channelsExample() {
	var chickenChannel = make(chan string)
	var saladChannel = make(chan string)
	var websites = []string{"zomato", "swiggy", "uber-eats"}

	for _, website := range websites {
		go checkChickenPrice(website, chickenChannel)
		go checkSaladPrice(website, saladChannel)
	}

	mailWhenPricesDrop(chickenChannel, saladChannel)
}

func checkChickenPrice(website string, chickenChannel chan string) {
	fmt.Println("check every second until deal is found on", website)
	for {
		time.Sleep(time.Duration(1000) * time.Millisecond)
		var currenPrice = rand.Float32() * 20

		if currenPrice < MAX_CHICKEN_PRICE {
			fmt.Println("chicken price dropped - break out and push", website, " in channel")
			chickenChannel <- website
			break
		}
	}
}

func checkSaladPrice(website string, saladChannel chan string) {
	fmt.Println("check every second until deal is found on", website)
	for {
		time.Sleep(time.Duration(1000) * time.Millisecond)
		var currenPrice = rand.Float32() * 20

		if currenPrice < MAX_SALAD_PRICE {
			fmt.Println("salad price dropped - break out and push", website, " in channel")
			saladChannel <- website
			break
		}
	}
}

func mailWhenPricesDrop(chickenChannel chan string, saladChannel chan string) {
	// waiting here till something is pushed to channel
	select {
	case website := <-chickenChannel:
		fmt.Println(">> Sending SMS. Found a deal on chicken - ", website)
	case website := <-saladChannel:
		fmt.Println(">> Sending EMAIL. Found a deal on chicken - ", website)
	}
}

type genericId[T int | string] struct {
	id T
}

func generics() {
	// to support generic types

	// var sumInt int = sumGeneric([]int{1, 2, 3, 4})
	var sumInt int = sumGeneric([]int{1, 2, 3, 4})
	fmt.Println(sumInt)

	var sumFloat float32 = sumGeneric([]float32{1.2, 3.4})
	fmt.Println(sumFloat)

	var points []point3D = loadJSON[point3D]("./points.json")
	fmt.Println(points)
	var shapes []shape3D = loadJSON[shape3D]("./shapes.json")
	fmt.Println(shapes)

	fmt.Println(genericId[int]{id: 1})
	fmt.Println(genericId[string]{id: "1"})
}

func sumGeneric[T int | float32 | float64](arr []T) T {
	var sum T

	for _, val := range arr {
		sum += val
	}

	return sum
}

func loadJSON[T point3D | shape3D](path string) []T {
	return []T{}
}
