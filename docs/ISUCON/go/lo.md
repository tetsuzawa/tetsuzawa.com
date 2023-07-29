# lo

## install

```shell
github.com/samber/lo
```

## []string を map[int]struct{} に変換する (疑似Set型)

```go
var loErrs []error
idsSet := lo.SliceToMap[string, int, struct{}](strIds, func(strId string) (int, struct{}) {
    id, err := strconv.ParseInt(strId, 10, 64)
    if err != nil {
         c.Logger().Error(err)
         loErrs = append(loErrs, err)
    }
    return int(id), struct{}{}
})
if len(loErrs) != 0 {
    c.Logger().Error(
         strings.Join(
             lo.Map(loErrs, func(e error, idx int) string { return e.Error() }),
             ", ",
         ),
    )
    return c.NoContent(http.StatusInternalServerError)
}
```