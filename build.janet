(use spork)
(use spork/sh-dsl)

(defn update-mirror [mirror-dir]
  (if-not (sh/exists? mirror-dir)
    ($ wget
       --adjust-extension
       --convert-links
       --directory-prefix (string mirror-dir)
       --include-directories "api,assets,capi,css,docs,jpm,js,spork"
       --mirror
       --no-verbose
       --page-requisites
       --random-wait
       --reject "ico"
       --wait 0.3
       "https://janet-lang.org/docs/index.html")))

(defn build-config [mirror-dir version]
  (spit "tmp/Janet.docsetconfig"
        (->> (slurp "src/Janet.docsetconfig")
             (string/replace "%cssToInject%"
                             (slurp "src/dashdocs.css"))
             (string/replace "%javaScriptUsedToIndex%"
                             (slurp "src/dashdocs.js"))
             (string/replace "%localFolderPath%"
                             (path/abspath mirror-dir))))
  (spit "dist/docset.json"
        (string/replace "%version%" version (slurp "src/docset.json"))))

(defn generate-docset []
  ($ ./vendor/DocsetGenerator/DocsetGenerator tmp/Janet.docsetconfig)
  ($ mv Janet.docset tmp/)
  (let [dist "dist/"]
    ($ cp "src/icon.png" "Janet.docset/")
    ($ cp "src/icon.png" "src/README.md" "dist/")
    ($ tar --exclude ".DS_Store" --exclude "log.txt" -czf dist/Janet.tgz tmp/Janet.docset))
  #   ($ mv "Janet.docset" "Janet.tgz" "build/"))
  )

(defn main [&]
  (try
    (let [mirror-dir (string "mirror/" (date/to-string (os/date) "yyyy-MM-dd"))
          version "1.42.1"]
      ($ rm -r "dist" "tmp")
      ($ mkdir "dist" "tmp")
      (update-mirror mirror-dir)
      (build-config mirror-dir version)
      (generate-docset))
    ([err] (print err))))
