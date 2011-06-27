import numpy as np
import datetime as dt
now = dt.datetime.now()
print '"Date A B\\n"+'
for i in range(50):
	print '"'+(now+dt.timedelta(seconds=i)).isoformat(), np.sin(i*2*np.pi/50), str(np.cos(i*np.pi/50))+'\\n"+'
