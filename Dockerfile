FROM justb4/jmeter:latest

WORKDIR /jmeter
COPY jmeter/ /jmeter/

ENTRYPOINT ["jmeter"]
