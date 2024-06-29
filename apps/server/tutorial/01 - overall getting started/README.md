# [Learn GO Fast: Full Tutorial](https://www.youtube.com/watch?v=8uiZC0l4Ajw&t=148s)

## Bullets

1. Statically typed language - declared or inferred
2. Strongly typed language - operations depend on type
3. Compiled
4. Fast compile time
5. Built in concurrency using Goroutines
6. Simplicity with syntax and garbage collection


### Tuts

- Go is just opposite from JS in some places
  - type is declare after variable name
  - spread operator is after variable name
  - Examples
    - `var num int`
    - `num := []int`
    - `append(slice1, slice2...)`
  - declaring a variable initializes it with default values for all primitive values
- Project init `go mod init NAME`
  - Creates a module named `NAME`
  - Usually `NAME` is the location in github repository
- `go mod tidy` is like `npm i`
- **Functions starting with capital letters can be imported by other packages**
- Starts from **main** package, declared with `package main`
- Package - Collection of Go files
- Module - Collection of packages
- Execute -
  1. Build - `go build FILE_OR_MODULE_PATH`
  2. Build and RUN - `go run FILE_OR_MODULE_PATH`
- Scope
  - Block scope
  - no hoisting
    ```go
    abc := 12
    fmt.Println(abc, &abc) // 12
    {
      fmt.Println(abc, &abc) // 12
      abc := 134
      fmt.Println(abc, &abc) // 134
    }
    ```
- Conditionals
  - `else` and `else if` needs to be in line of previous end bracket
- Common operators
  - `:=` declare and assign
  - `=` assign
  - `!=`, `==`, `&&`, `||`, etc.
- Error
  - type `error`
  - default value `nil`
  - initiate `errors.New("MESSAGE")`
  ```go
    var err error
    // after some logic
    err = errors.New("error message")
  ```
- Data types
  - numbers
    - int8, int16, int32, int64, uint8, uint16, uint32, uint64, float32, float64, float32, float64 (int8 -> 8bits -> 1 byte)
    - Compiler won't throw overflow errors at runtime
    - Default = 0
  - string
    - immutable
    - represented in utf8 encoding
    - `len("Á")` - string represents array of bytes - hence result is 2
    - `len("rÉSUMÊs")` - length is 9 because "É" takes 2 bytes storage and rest take 1
    - `str[1]` - value of 2nd byte is not utf8 code for "É", rather "É"'s first byte. It contains 2.
    - using `for i, char := range str` results in correct utf8-code for `char` as it does some extra work internally. **NOTE - index 2 and 7 are skipped**.
    - Default = ""
    - `utf8.RuneCountInString("Á")` - correct number of characters even for utf8
    - Better way to handle string is to use `str := []rune("rÉSUMÊs")`. It give correct length and utf8-code. Rune is alias for []int32. Hence can use `str := []int32("rÉSUMÊs")`
    - runeChar = 'a' <- in single quote
    - use `strings.Builder` for string concatanation
  - bool
    - Default = false
  - error
    - Default = nil
  - Arrays
    - Overview
      - Fixed length
      - same type
      - indexable
      - contiguous in memory
    - Default = all primitive values defaults
    - Slice
      - built over arrays. just ommit length in type
      - `len` - length of arr
      - `cap` - capacity as per memory allocated in array
      - `append` - if possible as per capacity, add to the array else create a new array and return
      - spread operator - `append(stringArr, stringArr2...)`
      - `make(type, length, optional capacity)`
  - Map
    - `map[string]uint8`
    - `make(map[string]uint8)`
    - invalid keys have default value for value type
    - safeguard `val, ok := obj2["random"]`
  - Structs and interfaces
    - declare type and instantiate using `a := point{x : 10, y: 12}`
    - during initialisation order of values if maintained and keys can be ommitted
    - combine/extend type by just mention type ins struct declaration
      ```
      type shapeV2 struct {
        shapeType string
        int
        point
      }
      ```
    - can make anonymous structs (define at initialisation without struct name)
    - binding method to type shape `func (s shape) print() {...}`
    - interface - mention mandatory fields and can be used as generic type to support multiple structs with necessary fields
      ```
      type shapeXD interface {
        print()
      }
      ```
    - cant be instantiated
  - Pointers
    - usual pointers - * for declaration, * for getting and setting values, & for address
    - arrays are not assigned/passed by reference. Hence, address needs to be passed
    - slices are by default assigned/passed by reference
- Loops
  - range
    ```go
    for key, val := range colors {
      fmt.Println("Map Item -", key, val)
    }
    ```
  - for
    ```go
    i := 0
    for {
      if i > 9 {
        break
      }
      fmt.Println("For loop", i)
      i++
    }
    ```
  - for condition
    ```go
    j := 0
    for j < 10 {
      fmt.Println("For loop conditional", j)
      j++
    }
    ```
  - for verbose
    ```go
    for j := 0; j < 10; j++ {
      fmt.Println("For loop verbose", j)
    }
    ```
- Go Routines
  - add concurrency to go. number of parallel executing tasks is number of cores
  - Example
    - Cores = 8
    - Function execution = 40ms
    - Run 1000 times with go routines
    - Total time = (1000 * 40) / 8 = 5s
  - add `go` in front of function. `go heavyFunction()`
  - WaitGroups
    - just like counter to mark - Add (increment), Done(decrement), Wait, when counter is back to 0
      ```go
      var wg = sync.WaitGroup{}

      func heavyFunction() {
        // ....

        wg.Done()
      }

      for j := 0; j < 10; j++ {
        wg.Add(1)
        go heavyFunction()
      } 

      wg.Wait()
      fmt.Println("All done")
      ```
  - Mutex
    - Locks read or (read & write) for preventing memory corruption
    - sync.Mutex
      ```go
      // for Full locks
      var mut = sync.Mutex()

      mut.Lock()
      // other go routines can't read or write till this is released
      mut.Unlock()
      ```
    - sync.RWMutex
      ```go
      // for Full locks
      var mut = sync.RWMutex()

      mut.Lock()
      // other go routines can't read or write till this is released
      mut.Unlock()

      mut.RLock()
      // other go routines can READ 
      // other go routing will wait for WRITE till this is released
      mut.RUnlock()
      ```
  - Channels
    - Hold data, thread safe (avoid data race), listen for add/remove so that we can block code execution
    - `channel <- data` push - waits till channel has space for new data
    - `<-channel` read - waits till something is pushed to channel.
    - can use `for val := range dbChannel {}` for listening all events
    - `close(channel)` - let the other process know that no more push to channel will be done. for-range loop won't wait infinitely. No deadlock error.
    - buffered channel `make(chan string, 5)` - can store upto 5 values in channel
      - multiple processes can push to channel upto buffer-length and don't have to wait for readers to make room in channel
      - write-read cycle will be faster
      - channel reader can still process long tasks even after all channels have pushed
    - `Select` 
      - keeps on listening to events on channel
      - once 1 channel gets a message -> execute statement and exit
      ```go
      select {
        case website := <-chickenChannel:
          fmt.Println("Sending SMS. Found a deal on chicken - ", website)
        case website := <-saladChannel:
          fmt.Println("Sending EMAIL. Found a deal on chicken - ", website)
      }
      ```
  - Generics
    - to support multiple types for a function or structs
    - also supports type as `any`
      ```go
      func sumGeneric[T int | float32 | float64](arr []T) T {
        var sum T

        for _, val := range arr {
          sum += val
        }

        return sum
      }
      ```
    - can be used with structs as well
      ```go
      type genericId[T int | string] struct {
        id T
      }

      fmt.Println(genericId[int]{id: 2})
      ```
