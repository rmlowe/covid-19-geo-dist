npm run build
aws s3 cp build s3://foreignvir.us/ --recursive
aws cloudfront create-invalidation --distribution-id E6T4DNK7V5B8U --paths "/*"
