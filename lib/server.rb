require './lib/init'

set :root, File.dirname(__FILE__) + '/../'

# root url, introducing you to Backbone
get '/' do
  erb :index
end

# This example simple returns a basic file with
# backbone code embeded. send_file is used so
# that there is no conflict with the JST
# (JavaScript Template) ERB syntax
get '/example1' do
  send_file 'views/example1.html'
end


# The following methods simulate responses from a database

# list all the items
get '/items' do
  [ Hash['name', 'car', 'price', '10.00'],
    Hash['name', 'boat', 'price', '12.00']
  ].to_json
end

# get an item with id
get '/items/:id' do
  Hash['name', 'car', 'price', '10.00'].to_json
end

# create a new item
post '/items' do
  puts "post /items"
end

# update an item
put '/items/:id' do
  puts "put /items"
end

# delete an item
delete '/items/:id' do
  puts "delete /items/:id"
end

get '/favicon.ico' do
  ""
end


