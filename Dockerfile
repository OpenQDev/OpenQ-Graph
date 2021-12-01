FROM node:lts-alpine
WORKDIR /app
RUN apk update && apk upgrade && \
	apk add --no-cache bash git curl
COPY package.json .
RUN yarn
COPY . .
RUN yarn codegen
CMD curl --connect-timeout 5 \
	--retry-connrefused \
	--max-time 10 \
	--retry 5 \
	--retry-delay 0 \
	--retry-max-time 40 \
	'http://graph_node:8020' \
	&& yarn create-docker \
	&& yarn deploy-docker