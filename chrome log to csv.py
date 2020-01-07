import os

for f in os.listdir():
        if f[-4:] == ".log":
                with open(f) as fil:
                        res = open(f[:-4] + ".csv","w")
                        for line in fil:
                                print(line.split(" ")[1:])
                                res.write(" ".join(line.split(" ")[1:]))