--Query 1
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
 VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Query 2
UPDATE public.account 
	SET account_type = 'Admin' 
	WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Query 3
DELETE FROM public.account 
	WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Query 4
UPDATE public.inventory
	SET inv_description = REPLACE(inv_description, 'a huge interior', 'small interiors')
	WHERE inv_make = 'GM' and inv_model = 'Hummer';

--Query 5
SELECT inv_make, inv_model
	FROM public.inventory
	JOIN public.classification
	ON public.inventory.classification_id = public.classification.classification_id
	WHERE public.classification.classification_name = 'Sport';

--Query 6
UPDATE public.inventory
	SET inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/'),
		inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/');