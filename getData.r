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

grepl("New York", "Los Angeles-Long Beach-Riverside, CA CSA")

justCities <- sapply(strsplit( smallCities$city, "\\,"), "[", 1)

#there are going to be multiple cities for some metro areas. Only take the biggest city.
metros = vector(,length(justCities)) #Initialize the vector
metros_pops = vector(,length(justCities))

for(i in 1:length(justCities)){
  city = justCities[i]
  
  metros[i] = NA
  metros_pops[i] = NA
  for(j in 1:length(smallCities$metro)){
    metro = smallCities$metro[j]
    
    #If the city name is in the metro name, we good.
    if(grepl(city, metro)){
      metros[i] = metro
      metros_pops[i] = smallCities$metro_pop[j]
    } 
  }
}

matched = data.frame(city = smallCities$city, city_pop = smallCities$city_pop, metro = metros, metro_pop = metros_pops )

