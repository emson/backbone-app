require './lib/init'


disable :logging
set :root, File.dirname(__FILE__) + '/../'

get '/' do
  send_file 'public/index.html'
end

get '/participants' do
  [ Hash['name', 'Ben', 'msisdn', '111'],
    Hash['name', 'Rup', 'msisdn', '222']
  ].to_json
end

post '/participants' do
  puts "post /participants"
end

post '/participants/:id' do
  puts "post /participants/:id"
end

put '/participants' do
  puts "put /participants"
end

put '/participants/:id' do
  puts "put /participants/:id"
end

get '/favicon.ico' do
  ""
end


