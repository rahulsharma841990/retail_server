<?php



 function url(){

 		return 'http://'.$_SERVER['HTTP_HOST'].'/retail_server/';
 }


 function json($arrayData){

 	echo json_encode($arrayData);
 }

 function redirect($path){

 	$path = url().'index.php/'.$path;
 	header('location:'.$path);
 }