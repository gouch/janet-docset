# Copyright © 2026 David Gouch | MIT License
(use spork)
(use spork/sh-dsl)

(defn deps-check [& deps]
  (if (nil? (all sh/which deps))
    (error "Missing dependencies")))

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

(defn build-config-files [mirror-dir version]
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

(defn prep-for-distribution []
  ($ cp "src/icon.png" "README.md" "dist/")
  ($ cp "src/icon.png" "Janet.docset/")

  # Add back key unexpectedly dropped by DocsetGenerator
  (let [plist "Janet.docset/Contents/Info.plist"]
    (spit plist (string/replace
                  "</dict>"
                  "<key>dashIndexFilePath</key><string>janet-lang.org/docs/index.html</string></dict>"
                  (slurp plist))))
  ($ mv Janet.docset tmp/)
  ($ tar --exclude ".DS_Store" --exclude "log.txt" -czf dist/Janet.tgz -C tmp Janet.docset))

(defn main [&]
  (try
    (let [mirror-dir (string "mirror/" (date/to-string (os/date) "yyyy-MM-dd"))
          version "1.42.1"]
      (deps-check "tar" "wget")
      (do # cleanup
        ($ rm -r "dist" "tmp")
        ($ mkdir "dist" "tmp"))
      (update-mirror mirror-dir)
      (build-config-files mirror-dir version)
      ($ ./vendor/DocsetGenerator/DocsetGenerator tmp/Janet.docsetconfig)
      (prep-for-distribution))
    ([err] (print err))))
