# pprof

## 事前準備

importブロック追加

```go
import  _ "net/http/pprof"
```

main.go にpprofのハンドラを追加する

```go
	handler := func(h http.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			h.ServeHTTP(c.Response(), c.Request())
			return nil
		}
	}
	
	prefixRouter := e.Group("/debug/pprof")
	{
		prefixRouter.GET("/", handler(pprof.Index))
		prefixRouter.GET("/allocs", handler(pprof.Handler("allocs").ServeHTTP))
		prefixRouter.GET("/block", handler(pprof.Handler("block").ServeHTTP))
		prefixRouter.GET("/cmdline", handler(pprof.Cmdline))
		prefixRouter.GET("/goroutine", handler(pprof.Handler("goroutine").ServeHTTP))
		prefixRouter.GET("/heap", handler(pprof.Handler("heap").ServeHTTP))
		prefixRouter.GET("/mutex", handler(pprof.Handler("mutex").ServeHTTP))
		prefixRouter.GET("/profile", handler(pprof.Profile))
		prefixRouter.POST("/symbol", handler(pprof.Symbol))
		prefixRouter.GET("/symbol", handler(pprof.Symbol))
		prefixRouter.GET("/threadcreate", handler(pprof.Handler("threadcreate").ServeHTTP))
		//prefixRouter.GET("/trace", echo.WrapHandler(pprof.Trace))
	}
```

## 計測 

line profiler


```shell
go tool pprof -list main. -cum -seconds 60 http://43.206.3.190/debug/pprof/profile
```


本番インスタンス内でも手元でも実行可能。
こんな感じで出力される。

```
#Fetching profile over HTTP from http://43.206.3.190/debug/pprof/profile?seconds=60
#Please wait... (1m0s)
#Saved profile in /home/isucon/pprof/pprof.app.samples.cpu.002.pb.gz
#Total: 2.08s
#ROUTINE ======================== main.getIndex in /home/isucon/private_isu/webapp/golang/app.go
#         0      1.59s (flat, cum) 76.44% of Total
#         .          .    376:func getIndex(w http.ResponseWriter, r *http.Request) {
#         .          .    377:	me := getSessionUser(r)
#         .          .    378:
#         .          .    379:	results := []Post{}
#         .          .    380:
#         .      1.27s    381:	err := db.Select(&results, "SELECT `id`, `user_id`, `body`, `mime`, `created_at` FROM `posts` ORDER BY `created_at` DESC")
#         .          .    382:	if err != nil {
#         .          .    383:		log.Print(err)
#         .          .    384:		return
#         .          .    385:	}
#         .          .    386:
#         .      300ms    387:	posts, err := makePosts(results, getCSRFToken(r), false)
#         .          .    388:	if err != nil {
#         .          .    389:		log.Print(err)
#         .          .    390:		return
#         .          .    391:	}
#         .          .    392:
#         .          .    393:	fmap := template.FuncMap{
#         .          .    394:		"imageURL": imageURL,
#         .          .    395:	}
#         .          .    396:
#         .          .    397:	template.Must(template.New("layout.html").Funcs(fmap).ParseFiles(
#         .          .    398:		getTemplPath("layout.html"),
#         .          .    399:		getTemplPath("index.html"),
#         .          .    400:		getTemplPath("posts.html"),
#         .          .    401:		getTemplPath("post.html"),
#         .       20ms    402:	)).Execute(w, struct {
#         .          .    403:		Posts     []Post
#         .          .    404:		Me        User
#         .          .    405:		CSRFToken string
#         .          .    406:		Flash     string
#         .          .    407:	}{posts, me, getCSRFToken(r), getFlash(w, r, "notice")})
#ROUTINE ======================== main.getPostsID in /home/isucon/private_isu/webapp/golang/app.go
#         0       10ms (flat, cum)  0.48% of Total
#         .          .    575:
#         .          .    576:	template.Must(template.New("layout.html").Funcs(fmap).ParseFiles(
#         .          .    577:		getTemplPath("layout.html"),
#         .          .    578:		getTemplPath("post_id.html"),
#         .          .    579:		getTemplPath("post.html"),
#         .       10ms    580:	)).Execute(w, struct {
#         .          .    581:		Post Post
#         .          .    582:		Me   User
#         .          .    583:	}{p, me})
#         .          .    584:}
#         .          .    585:
```