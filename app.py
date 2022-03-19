from flask import Flask, render_template, request

app= Flask(__name__)

@app.route("/meteo", methods=['GET'])
def index():
    query = request.arg.get('http://api.openweathermap.org/data/2.5/weather?q=paris&appid=e8e1dcbb0559820ba96f6138b409eaa2')

    return render_template("index.html", query = query)

if __name__ == "__main__":
    app.run(host='127.0.0.1', debug=True)