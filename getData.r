library(rvest)

# Grab all the datas. 
cities_wiki <- html("https://en.wikipedia.org/wiki/Cities_and_metropolitan_areas_of_the_United_States")
cities <- cities_wiki %>% 
  html_nodes(xpath='//*[@id="mw-content-text"]/table[3]') %>%
  html_table()

cities <- cities[[1]]

colnames(cities) = cities[1, ] # the first row will be the header
cities = cities[-1, ]  

# Let's trim this data
smallCities = cities[,c(2,3,8,9)]
head(smallCities)

# Use realistic column names
names(smallCities) <- c("city", "city_pop", "metro", "metro_pop")
head(smallCities)

# There are weird heart symbols in the data for some reason. Get rid of them. 
smallCities$city_pop  <- sapply(strsplit( smallCities$city_pop, "\\♠"), "[", 2)
smallCities$metro_pop <- sapply(strsplit( smallCities$metro_pop, "\\♠"), "[", 2)

# Get rid of the reference links in city names. E.g. New York, NY [12]
smallCities$city <- sapply(strsplit( smallCities$city, "\\["), "[", 1)

# oops, the city names don't match the metro names. Gotta pair them. 
