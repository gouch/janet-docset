(use sh)
(try
  (spit "build/Janet.docsetconfig"
        (string/replace "%javaScriptUsedToIndex%"
                        (slurp "src/dashdocs.js")
                        (string/replace "%cssToInject%"
                                        (slurp "src/dashdocs.css")
                                        (slurp "src/template.docsetconfig"))))
  ([err] (print err)))

(try
  ($ ./vendor/DocsetGenerator/DocsetGenerator build/Janet.docsetconfig)
  ([err] (print err)))
