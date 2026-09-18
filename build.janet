# Copyright © 2026 David Gouch | MIT License
(import spork/date)
(import spork/path)
(import spork/sh)
(use spork/sh-dsl)

(defn deps-check [& deps]
  (if (nil? (all sh/which deps))
    (error "Missing dependencies")))

(defn update-mirror [mirror-dir]
  (if (sh/exists? mirror-dir)
    (print "Building with " mirror-dir)
    ($ wget
       --adjust-extension
       --convert-links
       --directory-prefix (string mirror-dir)
       --include-directories "api,assets,capi,css,docs,jpm,js,spork"
       --mirror
       --no-host-directories
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
  ($ cp "src/icon.png" "src/icon@2x.png" "README.md" "dist/")
  ($ cp "src/icon.png" "src/icon@2x.png" "Janet.docset/")

  (let [plist "Janet.docset/Contents/Info.plist"]
    # Add back keys unexpectedly dropped by DocsetGenerator
    (spit plist (string/replace
                  "</dict>"
                  (string
                    "<key>DashDocSetFallbackURL</key><string>https://janet-lang.org/</string>\n"
                    "<key>dashIndexFilePath</key><string>docs/index.html</string>"
                    "</dict>")
                  (slurp plist))))
  ($ mv Janet.docset tmp/)
  ($ tar --exclude ".DS_Store" --exclude "log.txt" -czf dist/Janet.tgz -C tmp Janet.docset))


(defn main [&]
  (def stable-mirror "mirror/janet-lang.org-2026-09-17")
  (def version "1.42.0")
  (try
    (let [mirror-dir (if (has-value? (dyn *args*) "--stable")
                       stable-mirror
                       (string "mirror/janet-lang.org-"
                               (date/to-string (os/date) "yyyy-MM-dd")))]
      (deps-check "tar" "wget")
      (do # cleanup
        ($ rm -r "dist" "tmp")
        ($ mkdir "dist" "tmp"))
      (update-mirror mirror-dir)
      (build-config-files mirror-dir version)
      ($ ./vendor/DocsetGenerator/DocsetGenerator tmp/Janet.docsetconfig)
      (prep-for-distribution))
    ([err] (print err))))
