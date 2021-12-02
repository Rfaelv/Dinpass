import numpy as np 
import matplotlib.pyplot as plt
import pandas as pd
import math
import sys
import os

def harmonicProps(_direction, _frequency):
    if _direction == 'vertical':
        if _frequency > 1 and _frequency < 2.6:
            if _frequency >= 1.7 and _frequency <= 2.1:
                return 1, 280, '1'
            elif _frequency < 1.7:
                return 1/0.7*(_frequency - 1), 280, '1'
            else:
                return 1 - 1/0.5*(_frequency - 2.1), 280, '1'
        elif _frequency > 2.6 and _frequency < 5:
            if _frequency >= 3.4 and _frequency <= 4.2:
                return 1, 70, '2'
            elif _frequency < 3.4:
                return 1/0.8*(_frequency - 2.6), 70, '2'
            else:
                return 1 - 1/0.8*(_frequency - 4.2), 70, '2'
        else:
            return 0, 0, 'Nenhum'

    elif _direction == 'lateral':
        if _frequency > 0.3 and _frequency < 1.3:
            if _frequency >= 0.5 and _frequency <= 1.1:
                return 1, 280, '1'
            elif _frequency < 0.5:
                return 1/0.2*(_frequency - 0.3), 280, '1'
            else:
                return 1 - 1/0.2*(_frequency - 1.1), 280, '1'
        elif _frequency > 1.3 and _frequency < 2.5:
            if _frequency >= 1.7 and _frequency <= 2.1:
                return 1, 70, '2'
            elif _frequency < 1.7:
                return 1/0.4*(_frequency - 1.3), 70, '2'
            else:
                return 1 - 1/0.4*(_frequency - 2.1), 70, '2'
        else:
            return 0, 0, 'Nenhum'

def formatPath(_path):
    return _path.replace('\\', '/')

def displaceAndNormalize(_data):
    newData = list()
    minValue = _data[0]
    maxValue = _data[0]

    for value in _data:
        if abs(value) < abs(minValue):
            minValue = value
        if abs(value) > abs(maxValue):
            maxValue = value

    for value in _data:
        newData.append((value - minValue)/(maxValue - minValue))

    return newData

def convertDataToFloat(_data):
    newFloatData = list()
    for value  in _data:
        if ',' in str(value):
            newFloatData.append(float(str(value).replace(',', '.')))
        else:
            newFloatData.append(float(value))

    return newFloatData

def newtonInterpol(_point, _xdata, _ydata):
    for i, value in enumerate(_xdata):
        if value == _point:
            return _ydata[i]

        elif i > 0 and i < len(_xdata) - 3:
            if _point > value and _point < _xdata[i + 1]:
                x1 = _xdata[i - 1]
                y1 = _ydata[i - 1]
                x2 = _xdata[i]
                y2 = _ydata[i]
                x3 = _xdata[i + 1]
                y3 = _ydata[i + 1]
                x4 = _xdata[i + 2]
                y4 = _ydata[i + 2]

                delt11 = (y2 - y1)/(x2 - x1)
                delt12 = (y3 - y2)/(x3 - x2)
                delt13 = (y4 - y3)/(x4 - x3)

                delt21 = (delt12 - delt11)/(x3 - x1)
                delt22 = (delt13 - delt12)/(x4 - x2)

                delt31 = (delt22 - delt21)/(x4 - x1)

                return y1 + (_point - x1)*delt11 + (_point - x1)*(_point - x2)*delt21 + (_point - x1)*(_point - x2)*(_point - x3)*delt31

        if i <= 1 and _point < value:
            x1 = _xdata[i + 3]
            y1 = _ydata[i + 3]
            x2 = _xdata[i + 2]
            y2 = _ydata[i + 2]
            x3 = _xdata[i + 1]
            y3 = _ydata[i + 1]
            x4 = _xdata[i]
            y4 = _ydata[i]


            delt11 = (y2 - y1)/(x2 - x1)
            delt12 = (y3 - y2)/(x3 - x2)
            delt13 = (y4 - y3)/(x4 - x3)

            delt21 = (delt12 - delt11)/(x3 - x1)
            delt22 = (delt13 - delt12)/(x4 - x2)

            delt31 = (delt22 - delt21)/(x4 - x1)

            return y1 + (_point - x1)*delt11 + (_point - x1)*(_point - x2)*delt21 + (_point - x1)*(_point - x2)*(_point - x3)*delt31

        elif i >= len(_xdata) - 3:
            x1 = _xdata[i - 3]
            y1 = _ydata[i - 3]
            x2 = _xdata[i - 2]
            y2 = _ydata[i - 2]
            x3 = _xdata[i - 1]
            y3 = _ydata[i - 1]
            x4 = _xdata[i]
            y4 = _ydata[i]

            delt11 = (y2 - y1)/(x2 - x1)
            delt12 = (y3 - y2)/(x3 - x2)
            delt13 = (y4 - y3)/(x4 - x3)

            delt21 = (delt12 - delt11)/(x3 - x1)
            delt22 = (delt13 - delt12)/(x4 - x2)

            delt31 = (delt22 - delt21)/(x4 - x1)

            return y1 + (_point - x1)*delt11 + (_point - x1)*(_point - x2)*delt21 + (_point - x1)*(_point - x2)*(_point - x3)*delt31

def gaussianQuadrature1(_numPoints, _supLimit, _infLimit):
    points, weights = np.polynomial.legendre.leggauss(_numPoints)
    solToPoint = np.zeros((_numPoints))
    sol = 0
    for i, value in enumerate(solToPoint):
        x = (_supLimit - _infLimit) / 2 * points[i] + (_supLimit + _infLimit) / 2
        value = (_supLimit - _infLimit) / 2 * newtonInterpol(x, xPosition, fi)
        sol += weights[i] * value
    return sol

def gaussianQuadrature2(_numPoints, _infLimit, _supLimit):
    points, weights = np.polynomial.legendre.leggauss(_numPoints)
    solToPoint = np.zeros((_numPoints))
    sol = 0
    for i, value in enumerate(solToPoint):
        x = (_supLimit - _infLimit) / 2 * points[i] + (_supLimit + _infLimit) / 2
        value = (_supLimit - _infLimit) / 2 * newtonInterpol(x, xPosition, fi)**2
        sol += weights[i] * value

    return sol

def generateGraph(_xdata, _ydata, _xlegend, _ylegend, _name):
    fig, ax = plt.subplots()
    plt.xlabel(_xlegend)
    plt.ylabel(_ylegend)

    ax.plot(_xdata, _ydata, color='blue', linewidth=0.4)
    ax.set_xlim(min(_xdata), max(_xdata) + (max(_xdata) - min(_xdata))/20)

    if min(_ydata) == 0:
        ax.set_ylim(min(_ydata), max(_ydata) + max(_ydata)/20)

    plt.ticklabel_format(style='sci', axis='both', scilimits=(-3,4))
    plt.grid(True)
    plt.savefig(f'{userDataPath}/data/{_name}.png')

def modalForce(_t):
    forceValue = d*param*unitWeight*math.cos(w*_t)*1.85*(1/n)**0.5
    modalForce = width*forceValue*factor1
    return modalForce

def f(_x, _y):
    force = modalForce(_x)
    valuek0 = _y[1]
    valuek1 = ((-2*w*damping*modalMass*_y[1]) - _y[0]*modalK + force)/modalMass
    return np.array([valuek0, valuek1])

def RK4(_inicialx, _finalx, _nInterval, _inicialy0, _inicialy1):
    sol = np.asmatrix(np.zeros((_nInterval + 1, 4)))
    h = (_finalx - _inicialx)/_nInterval
    x = _inicialx
    y0 = _inicialy0
    y1 = _inicialy1

    y = np.array([y0, y1])

    sol[0, 0] = x
    sol[0, 1] = y[0]
    sol[0, 2] = y[1]
    sol[0, 3] = 0

    for i in range(_nInterval):
        yante = y
        K1 = f(x, y)
        K2 = f(x + h/2, y + h/2*K1)
        K3 = f(x + h/2, y + h/2*K2)
        K4 = f(x + h, y + h*K3)
        y = y + h/6*(K1 + 2*K2 + 2*K3 + K4)
        x = x + h

        sol[i + 1, 0] = x
        sol[i + 1, 1] = y[0]
        sol[i + 1, 2] = y[1]
        sol[i + 1, 3] = (y[1] - yante[1])/h
    return sol


# Getting analysi data

tablePath = sys.argv[1]
naturalFrequency = float(sys.argv[2])
mass = float(sys.argv[3])
damping = float(sys.argv[4])
lenght = float(sys.argv[5])
width = float(sys.argv[6])
direction = sys.argv[7]
ptGauss = int(sys.argv[8])
t0 = int(sys.argv[9])
tf = int(sys.argv[10])
nInterval = int(sys.argv[11])
userDataPath = sys.argv[12]

# direction = 'vertical'
# naturalFrequency = 3.96
# lenght = 34.087
# mass = 9724
# damping = 0.84/100
# width = 3

# Getting data from table

data = pd.read_excel(tablePath)
displacementLabel = 'u'
coordenateLabel = 'x'

try:
    data['u']
except Exception:
    displacementLabel = 'U'

try:
    data['x']
except Exception:
    displacementLabel = 'X'

displacement = convertDataToFloat(data[displacementLabel])

fi = np.array(displaceAndNormalize(displacement))
xPosition = np.array(convertDataToFloat(data[coordenateLabel]))
w = 2*(math.pi)*naturalFrequency

d = 1
n = width*lenght*d
param, unitWeight, harmonicNumber = harmonicProps(direction, naturalFrequency)
factor1 = gaussianQuadrature1(ptGauss, 0, lenght)
factor2 = gaussianQuadrature2(ptGauss, 0, lenght)
modalMass = mass/lenght*factor2
modalK = modalMass*w**2

sol = RK4(t0, tf, nInterval, 0, 0)

# t = np.linspace(t0, (tf - t0)/nInterval, tf)

# N = len(sol[:,3])//2
# fft = np.fft.fft(sol[:,3][N:])
# T = (tf - t0)/nInterval

# f = np.fft.fftfreq(N//2, T)
# xf = np.linspace(0.0, 1.0/(2.0*T), N//2)
# frequencias = f[:N // 2]
# amplitudes = np.abs(fft)[:N // 2] * 1 / N

# Y    = numpy.fft.fft(sol[:,3][1800:])
# freq = numpy.fft.fftfreq(2500-1800, T)

generateGraph(xPosition, fi, 'Posição (m)', 'Φ', 'autoVetorGraph')
generateGraph(sol[:,0], sol[:,1], 'Tempo (s)', 'Deslocamento (m)', 'deslocGraph')
generateGraph(sol[:,0], sol[:,2], 'Tempo (s)', 'Velocidade (m/s)', 'velocGraph')
generateGraph(sol[:,0], sol[:,3], 'Tempo (s)', 'Aceleração (m/s²)', 'acelGraph')
generateGraph(xPosition, fi*(max(sol[:,1])[0, 0]), 'Posição (m)', 'Deslocamento máximo (m)', 'maxDeslocGraph')
generateGraph(xPosition, fi*(max(sol[:,2])[0, 0]), 'Posição (m)', 'Velocidade máxima (m)', 'maxVelocGraph')
generateGraph(xPosition, fi*(max(sol[:,3])[0, 0]), 'Posição (m)', 'Aceleração máxima (m)', 'maxAcelGraph')
# generateGraph(freq, Y, 'Amplitude', 'Frequência (Hz)', 'FFTGraph')

# sys.stdin.read(1)
solution = {"massaModal": modalMass, "rigidezModal": modalK, "harmonico": harmonicNumber, "deslocMax": max(sol[:,1])[0, 0], "velMax": max(sol[:,2])[0, 0], "acelMax": max(sol[:,3])[0, 0]}
print(solution)
