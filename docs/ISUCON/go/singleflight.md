# singleflight

thundering herd問題の解消に有効。
レスポンスは全部同じになるのにリクエストが同時にたくさんきてDBに負荷かかる時とかに有効

参考 https://christina04.hatenablog.com/entry/go-singleflight

```go
package main

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"golang.org/x/sync/singleflight"
)

var handlerSfg singleflight.Group

// GET /hoge/:id
func Handler(c echo.Context) error {
	// 指定時間以内に来たリクエストをまとめて返す。
	// レスポンス時間と負荷低減のバランスは調整が必要
	maxDur := time.Millisecond * 500

	// keyでリクエストをまとめることができる。空文字で全部まとめることも可能
	id := c.Param("id")
	res, err, shared := handlerSfg.Do(id, func() (res interface{}, err error) {
		startAt := time.Now()
		res, err = doSomthing()
		if err != nil {
			return nil, err
		}

		// 指定時間以内に来たリクエストをまとめて返すためにsleep
		if dur := time.Now().Sub(startAt); dur < maxDur {
			time.Sleep(maxDur - dur)
		}

		return res, nil
	})
	// log.Println(shared)
	if err != nil {
		c.Logger().Errorf("error: %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}
}
```