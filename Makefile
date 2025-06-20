chown-for-editing:
	sudo chmod -R g+w .

chown-for-commit:
	sudo chown -R $USER:$USER .

su:
	sudo su ch


commit-and-push:
	git add .
	git commit -m "changes"
	make chown-for-commit
	git push origin main
	make chown-for-editing