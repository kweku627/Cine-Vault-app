#!/bin/bash

# CineVault Database Population Script
# Run this script after starting your Spring Boot application

BASE_URL="http://localhost:8080/api"
SERIES_ENDPOINT="$BASE_URL/series"

echo "🎬 CineVault Database Population Script"
echo "=================================================="
echo "📡 Connecting to: $BASE_URL"
echo ""

# Check if server is running
echo "🔍 Checking if server is running..."
if curl -s "$SERIES_ENDPOINT" > /dev/null 2>&1; then
    echo "✅ Server is running!"
else
    echo "❌ Error: Spring Boot server is not running!"
    echo "Please start your application with: mvn spring-boot:run"
    exit 1
fi

echo ""
echo "🚀 Starting database population..."
echo "=================================================="

# Function to create a series
create_series() {
    local series_id=$1
    local title=$2
    local overview=$3
    local release_date=$4
    local video_url=$5
    
    echo "📝 Creating: $title (ID: $series_id)"
    
    response=$(curl -s -w "%{http_code}" -X POST "$SERIES_ENDPOINT" \
        -H "Content-Type: application/json" \
        -d "{
            \"seriesId\": $series_id,
            \"title\": \"$title\",
            \"overview\": \"$overview\",
            \"releaseDate\": \"$release_date\",
            \"episodes\": [
                {
                    \"seasonNumber\": 1,
                    \"episodeNumber\": 1,
                    \"title\": \"Episode 1 of $title\",
                    \"overview\": \"Overview of episode 1 in $title.\",
                    \"releaseDate\": \"$release_date\",
                    \"videoUrl\": \"$video_url\"
                }
            ]
        }")
    
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        echo "✅ Successfully created: $title"
    else
        echo "❌ Failed to create $title: HTTP $http_code"
        echo "Response: $body"
    fi
    
    # Small delay to avoid overwhelming the server
    sleep 0.5
}

# Create all series
create_series 1001 "Sample Series 1" "Overview of sample series 1." "2010-01-01" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
create_series 1002 "Sample Series 2" "Overview of sample series 2." "2011-01-02" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
create_series 1003 "Sample Series 3" "Overview of sample series 3." "2012-01-03" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
create_series 1004 "Sample Series 4" "Overview of sample series 4." "2013-01-04" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
create_series 1005 "Sample Series 5" "Overview of sample series 5." "2014-01-05" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
create_series 1006 "Sample Series 6" "Overview of sample series 6." "2015-01-06" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
create_series 1007 "Sample Series 7" "Overview of sample series 7." "2016-01-07" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
create_series 1008 "Sample Series 8" "Overview of sample series 8." "2017-01-08" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
create_series 1009 "Sample Series 9" "Overview of sample series 9." "2018-01-09" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"
create_series 1010 "Sample Series 10" "Overview of sample series 10." "2019-01-10" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
create_series 1011 "Sample Series 11" "Overview of sample series 11." "2010-01-11" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
create_series 1012 "Sample Series 12" "Overview of sample series 12." "2011-01-12" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
create_series 1013 "Sample Series 13" "Overview of sample series 13." "2012-01-13" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
create_series 1014 "Sample Series 14" "Overview of sample series 14." "2013-01-14" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
create_series 1015 "Sample Series 15" "Overview of sample series 15." "2014-01-15" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
create_series 1016 "Sample Series 16" "Overview of sample series 16." "2015-01-16" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
create_series 1017 "Sample Series 17" "Overview of sample series 17." "2016-01-17" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
create_series 1018 "Sample Series 18" "Overview of sample series 18." "2017-01-18" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
create_series 1019 "Sample Series 19" "Overview of sample series 19." "2018-01-19" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"
create_series 1020 "Sample Series 20" "Overview of sample series 20." "2019-01-20" "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"

echo ""
echo "=================================================="
echo "📊 Population complete!"
echo ""
echo "🔍 Verifying population..."
echo "=================================================="

# Verify the population
response=$(curl -s "$SERIES_ENDPOINT")
if [ $? -eq 0 ]; then
    series_count=$(echo "$response" | grep -o '"seriesId"' | wc -l)
    echo "✅ Found $series_count series in database"
    echo ""
    echo "📋 First 5 series in database:"
    echo "$response" | grep -o '"title":"[^"]*"' | head -5 | sed 's/"title":"/  /' | sed 's/"$//'
else
    echo "❌ Verification failed"
fi

echo ""
echo "🎉 Script completed!"
echo "🌐 You can now test the API at: $BASE_URL/series" 