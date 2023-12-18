from apiflask import APIFlask, Schema, abort
from apiflask.fields import Integer, String
from apiflask.validators import Length, OneOf

app = APIFlask(__name__, docs_path="/apidocs", root_path="shapi")

class ShortDurationOut(Schema):
    total = Integer()

class LongDurationOut(Schema):
    total = Integer()

@app.get('/health_check')
def health_check():
    # returning a dict or list equals to use jsonify()
    return {'health': 'SUPER UP!'}


@app.get('/long_duration')
@app.output(LongDurationOut)
def long_duration():
    total = 0
    for i in range(0,100000000):
        total += i
    return {"total" : total}


@app.get('/short_duration')
@app.output(ShortDurationOut)
def short_duration():
    total = 0
    for i in range(0,1000):
        total += i
    return {"total" : total}

if __name__ == "__main__":  # pragma: no cover
    app.run(port=5000, debug=False, use_reloader=False)
