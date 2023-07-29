# Set型


```go
type Set[E comparable] map[E]struct{}

//func NewSet[E comparable]() Set[E] {
//	return Set[E]{}
//}

//func (s Set[E]) Add(v E) {
//	s[v] = struct{}{}
//}

// s := NewSet[string]()
// s.Add("hello")
// fmt.Println(s.Contains("hello"))
// // true
func (s Set[E]) Contains(v E) bool {
	_, ok := s[v]
	return ok
}

// NewSetは1つしか定義できない
// s := NewSet(1, 2, 3) // no need to say “[int]”
func NewSet[E comparable](vals ...E) Set[E] {
	s := Set[E]{}
	for _, v := range vals {
		s[v] = struct{}{}
	}
	return s
}

// s.Add(true, true)
// fmt.Println(s.Contains(false))
func (s Set[E]) Add(vals ...E) {
	for _, v := range vals {
		s[v] = struct{}{}
	}
}

// s := NewSet(1, 2, 3)
// fmt.Println(s.Members())
// // [1 2 3]
func (s Set[E]) Members() []E {
	result := make([]E, 0, len(s))
	for v := range s {
		result = append(result, v)
	}
	return result
}

// fmt.Println(s)
// // [2 3 1]
func (s Set[E]) String() string {
	return fmt.Sprintf("%v", s.Members())
}

// s1 := NewSet(1, 2, 3)
// s2 := NewSet(3, 4, 5)
// fmt.Println(s1.Union(s2))
// // [1 2 3 4 5]
func (s Set[E]) Union(s2 Set[E]) Set[E] {
	result := NewSet(s.Members()...)
	result.Add(s2.Members()...)
	return result
}

// s1 := NewSet(1, 2, 3)
// s2 := NewSet(3, 4, 5)
// fmt.Println(s1.Intersection(s2))
// [3]
func (s Set[E]) Intersection(s2 Set[E]) Set[E] {
	result := NewSet[E]()
	for _, v := range s.Members() {
		if s2.Contains(v) {
			result.Add(v)
		}
	}
	return result
}
```